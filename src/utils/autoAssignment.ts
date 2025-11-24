import api from "../services/apiExtensions";

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface Complaint {
  _id: string;
  category: string;
  priority: string;
  assignedTo?: string;
}

// interface WorkloadStats {
//   staffId: string;
//   activeComplaints: number;
//   avgResponseTime: number;
//   categories: string[];
// }

/**
 * Intelligent auto-assignment algorithm
 * Considers: workload balance, category expertise, priority, response time
 */
export class AutoAssignmentService {
  private static instance: AutoAssignmentService;
  // internal workload cache (unused right now) - kept for future improvements
  // private staffWorkload: Map<string, WorkloadStats> = new Map();

  private constructor() {}

  static getInstance(): AutoAssignmentService {
    if (!AutoAssignmentService.instance) {
      AutoAssignmentService.instance = new AutoAssignmentService();
    }
    return AutoAssignmentService.instance;
  }

  /**
   * Find the best staff member to assign a complaint to
   */
  async findBestStaffForComplaint(
    complaint: Complaint
  ): Promise<string | null> {
    try {
      // Get all staff members
      const staffResponse = await api.getAllUsers({ role: "staff" });
      const staffMembers: StaffMember[] = staffResponse.data;

      if (staffMembers.length === 0) {
        console.warn("No staff members available for assignment");
        return null;
      }

      // Get current complaints to calculate workload
      const complaintsResponse = await api.getComplaints({
        status: "pending,in-progress",
      });
      const activeComplaints = complaintsResponse.data;

      // Calculate workload for each staff member
      const staffScores = await Promise.all(
        staffMembers.map(async (staff) => {
          const score = await this.calculateStaffScore(
            staff,
            complaint,
            activeComplaints
          );
          return { staffId: staff._id, score, staff };
        })
      );

      // Sort by score (higher is better) and return the best match
      staffScores.sort((a, b) => b.score - a.score);

      if (staffScores.length > 0 && staffScores[0].score > 0) {
        return staffScores[0].staffId;
      }

      // Fallback: round-robin assignment
      return staffMembers[0]._id;
    } catch (error) {
      console.error("Auto-assignment failed:", error);
      return null;
    }
  }

  /**
   * Calculate a score for how suitable a staff member is for a complaint
   * Higher score = better match
   */
  private async calculateStaffScore(
    staff: StaffMember,
    complaint: Complaint,
    activeComplaints: any[]
  ): Promise<number> {
    let score = 100; // Base score

    // Factor 1: Current workload (lower is better)
    const staffComplaints = activeComplaints.filter(
      (c: any) => c.assignedTo?._id === staff._id || c.assignedTo === staff._id
    );
    const workloadPenalty = staffComplaints.length * 10;
    score -= workloadPenalty;

    // Factor 2: Category expertise (bonus if staff has handled this category before)
    const categoryExperience = staffComplaints.filter(
      (c: any) => c.category === complaint.category
    ).length;
    const categoryBonus = Math.min(categoryExperience * 5, 25);
    score += categoryBonus;

    // Factor 3: Priority handling (high priority complaints get priority)
    if (complaint.priority === "high") {
      // Assign to staff with lower workload for high priority
      score += 20 - workloadPenalty * 0.5;
    }

    // Factor 4: Avoid overloading (max 10 active complaints per staff)
    if (staffComplaints.length >= 10) {
      score -= 50;
    }

    // Factor 5: Recent performance (bonus for staff with fewer pending complaints)
    const pendingCount = staffComplaints.filter(
      (c) => c.status === "pending"
    ).length;
    score -= pendingCount * 5;

    return Math.max(score, 0);
  }

  /**
   * Auto-assign a complaint to the best available staff member
   */
  async autoAssignComplaint(complaintId: string): Promise<boolean> {
    try {
      const complaint = await api.getComplaintById(complaintId);

      if (complaint.data.assignedTo) {
        console.log("Complaint already assigned");
        return false;
      }

      const bestStaffId = await this.findBestStaffForComplaint(complaint.data);

      if (!bestStaffId) {
        console.warn("No suitable staff found for auto-assignment");
        return false;
      }

      await api.assignComplaint(complaintId, bestStaffId);
      console.log(
        `Auto-assigned complaint ${complaintId} to staff ${bestStaffId}`
      );
      return true;
    } catch (error) {
      console.error("Failed to auto-assign complaint:", error);
      return false;
    }
  }

  /**
   * Check for overdue complaints and escalate them
   */
  async checkAndEscalateOverdue(): Promise<void> {
    try {
      const complaintsResponse = await api.getComplaints({
        status: "pending,in-progress",
      });
      const complaints = complaintsResponse.data;

      const now = new Date();
      const overdueThreshold = 72 * 60 * 60 * 1000; // 72 hours

      for (const complaint of complaints) {
        const createdAt = new Date(complaint.createdAt);
        const timeDiff = now.getTime() - createdAt.getTime();

        // Escalate if pending for more than 72 hours
        if (timeDiff > overdueThreshold && complaint.status === "pending") {
          await api.escalateComplaint(
            complaint._id,
            "Automatically escalated due to extended pending time (>72 hours)"
          );
          console.log(`Escalated overdue complaint: ${complaint._id}`);
        }

        // Escalate high priority if pending for more than 24 hours
        if (
          complaint.priority === "high" &&
          timeDiff > 24 * 60 * 60 * 1000 &&
          complaint.status === "pending"
        ) {
          await api.escalateComplaint(
            complaint._id,
            "Automatically escalated: High priority complaint pending >24 hours"
          );
          console.log(`Escalated high priority complaint: ${complaint._id}`);
        }
      }
    } catch (error) {
      console.error("Failed to check and escalate overdue complaints:", error);
    }
  }

  /**
   * Rebalance workload by reassigning complaints from overloaded staff
   */
  async rebalanceWorkload(): Promise<void> {
    try {
      const staffResponse = await api.getAllUsers({ role: "staff" });
      const staffMembers: StaffMember[] = staffResponse.data;

      const complaintsResponse = await api.getComplaints({
        status: "pending,in-progress",
      });
      const activeComplaints = complaintsResponse.data;

      // Calculate workload for each staff
      const workloadMap = new Map<string, any[]>();
      staffMembers.forEach((staff) => {
        const staffComplaints = activeComplaints.filter(
          (c: any) => c.assignedTo?._id === staff._id || c.assignedTo === staff._id
        );
        workloadMap.set(staff._id, staffComplaints);
      });

      // Find overloaded staff (>8 complaints)
      const avgWorkload =
        activeComplaints.length / Math.max(staffMembers.length, 1);
      const threshold = Math.max(avgWorkload * 1.5, 8);

      for (const [staffId, complaints] of workloadMap.entries()) {
        if (complaints.length > threshold) {
          // Reassign some complaints to less loaded staff
          const excessComplaints = complaints.slice(
            Math.floor(threshold),
            complaints.length
          );

          for (const complaint of excessComplaints) {
            const newStaffId = await this.findBestStaffForComplaint(complaint);
            if (newStaffId && newStaffId !== staffId) {
              await api.assignComplaint(complaint._id, newStaffId);
              console.log(
                `Rebalanced: Moved complaint ${complaint._id} from ${staffId} to ${newStaffId}`
              );
            }
          }
        }
      }
    } catch (error) {
      console.error("Failed to rebalance workload:", error);
    }
  }
}

export default AutoAssignmentService.getInstance();
