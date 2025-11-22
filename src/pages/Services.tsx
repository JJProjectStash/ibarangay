import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import api from "../services/api";
import { Service } from "../types";
import { format } from "date-fns";
import { showSuccessToast, showErrorToast } from "../components/Toast";
import { getErrorMessage } from "../utils/errorHandler";
import { validators, getValidationMessage } from "../utils/validators";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";

const Services: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showItemTypeModal, setShowItemTypeModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [itemTypes, setItemTypes] = useState<string[]>([]);
  const [newItemTypes, setNewItemTypes] = useState<string>("");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    itemName: "",
    itemType: "",
    borrowDate: "",
    expectedReturnDate: "",
    purpose: "",
    quantity: 1,
    notes: "",
  });

  useEffect(() => {
    fetchServices();
    fetchItemTypes();
  }, []);

  const fetchItemTypes = async () => {
    try {
      const response = await api.getServiceItemTypes();
      setItemTypes(response.data || []);
    } catch (error) {
      console.error("Failed to fetch item types:", error);
    }
  };

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      const response = await api.getServiceRequests();
      const servicesData = Array.isArray(response.data) ? response.data : [];
      setServices(servicesData);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      showErrorToast(getErrorMessage(error));
      setServices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateItemTypes = async () => {
    try {
      const itemTypeArray = newItemTypes
        .split(",")
        .map((type) => type.trim())
        .filter((type) => type.length > 0);

      if (itemTypeArray.length === 0) {
        showErrorToast("Please enter at least one item type");
        return;
      }

      await api.updateServiceItemTypes(itemTypeArray);
      showSuccessToast("Item types updated successfully!");
      setShowItemTypeModal(false);
      setNewItemTypes("");
      fetchItemTypes();
    } catch (error) {
      console.error("Failed to update item types:", error);
      showErrorToast(getErrorMessage(error));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!validators.required(formData.itemName)) {
      newErrors.itemName = getValidationMessage("Item name", "required");
    }

    if (!validators.required(formData.itemType)) {
      newErrors.itemType = getValidationMessage("Item type", "required");
    }

    if (!validators.required(formData.borrowDate)) {
      newErrors.borrowDate = getValidationMessage("Borrow date", "required");
    }

    if (!validators.required(formData.expectedReturnDate)) {
      newErrors.expectedReturnDate = getValidationMessage(
        "Expected return date",
        "required"
      );
    }

    // Validate that expected return date is after borrow date
    if (formData.borrowDate && formData.expectedReturnDate) {
      const borrowDate = new Date(formData.borrowDate);
      const returnDate = new Date(formData.expectedReturnDate);
      if (returnDate <= borrowDate) {
        newErrors.expectedReturnDate =
          "Expected return date must be after borrow date";
      }
    }

    if (!validators.required(formData.purpose)) {
      newErrors.purpose = getValidationMessage("Purpose", "required");
    }

    if (!validators.isPositiveNumber(formData.quantity.toString())) {
      newErrors.quantity = "Quantity must be a positive number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showErrorToast("Please fix the form errors");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createServiceRequest(formData);
      showSuccessToast("Service request submitted successfully!");
      setShowModal(false);
      setFormData({
        itemName: "",
        itemType: "",
        borrowDate: "",
        expectedReturnDate: "",
        purpose: "",
        quantity: 1,
        notes: "",
      });
      setErrors({});
      fetchServices();
    } catch (error) {
      console.error("Failed to create service request:", error);
      showErrorToast(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: "" });
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        icon: JSX.Element;
      }
    > = {
      pending: {
        variant: "outline",
        icon: <Clock className="h-3 w-3" />,
      },
      approved: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      borrowed: {
        variant: "secondary",
        icon: <Package className="h-3 w-3" />,
      },
      returned: {
        variant: "default",
        icon: <CheckCircle className="h-3 w-3" />,
      },
      rejected: {
        variant: "destructive",
        icon: <XCircle className="h-3 w-3" />,
      },
    };
    return badges[status] || badges.pending;
  };

  const canEditItemTypes = user?.role === "admin" || user?.role === "staff";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6 page-transition">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="animate-in slide-in-from-top-4 duration-500">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2">
                Borrow & Return Services
              </h1>
              <p className="text-muted-foreground text-lg">
                Request to borrow barangay equipment and facilities
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              {canEditItemTypes && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setNewItemTypes(itemTypes.join(", "));
                    setShowItemTypeModal(true);
                  }}
                  className="hover-lift"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Manage Item Types
                </Button>
              )}
              <Button
                onClick={() => setShowModal(true)}
                className="shadow-lg shadow-primary/20 hover-lift"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {services.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No service requests yet"
            description="Create your first service request to get started"
          />
        ) : (
          <div className="grid gap-6 animate-in fade-in duration-700 delay-100">
            {services.map((service) => {
              const statusBadge = getStatusBadge(service.status);
              return (
                <Card
                  key={service._id}
                  className="glass-card card-hover overflow-hidden group"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {service.itemName}
                        </CardTitle>
                        <p className="text-muted-foreground mt-1">
                          {service.itemType}
                        </p>
                      </div>
                      <Badge
                        variant={statusBadge.variant}
                        className="flex items-center gap-1"
                      >
                        {statusBadge.icon}
                        {service.status.charAt(0).toUpperCase() +
                          service.status.slice(1)}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Quantity
                        </p>
                        <p className="font-medium">{service.quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Borrow Date
                        </p>
                        <p className="font-medium">
                          {format(new Date(service.borrowDate), "MMM dd, yyyy")}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">
                          Expected Return
                        </p>
                        <p className="font-medium">
                          {format(
                            new Date(service.expectedReturnDate),
                            "MMM dd, yyyy"
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Purpose</p>
                      <p className="text-sm">{service.purpose}</p>
                    </div>

                    {service.notes && (
                      <div className="p-3 bg-muted/50 rounded-lg space-y-1">
                        <p className="text-sm text-muted-foreground">Notes</p>
                        <p className="text-sm">{service.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Item Type Management Modal */}
        <Dialog open={showItemTypeModal} onOpenChange={setShowItemTypeModal}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Manage Service Item Types</DialogTitle>
              <DialogDescription>
                Update the available item types for service requests
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemTypes">Item Types (comma-separated)</Label>
                <Textarea
                  id="itemTypes"
                  rows={4}
                  value={newItemTypes}
                  onChange={(e) => setNewItemTypes(e.target.value)}
                  placeholder="e.g., equipment, facility, document, other"
                />
                <p className="text-sm text-muted-foreground">
                  Current item types: {itemTypes.join(", ")}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowItemTypeModal(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleUpdateItemTypes}>Update Item Types</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Create Service Request Modal */}
        <Dialog
          open={showModal}
          onOpenChange={(open) => !isSubmitting && setShowModal(open)}
        >
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>New Service Request</DialogTitle>
              <DialogDescription>
                Submit a request to borrow barangay equipment or facilities
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="itemName">Item Name *</Label>
                <Input
                  id="itemName"
                  value={formData.itemName}
                  onChange={(e) =>
                    handleInputChange("itemName", e.target.value)
                  }
                  disabled={isSubmitting}
                  placeholder="e.g., Folding Chairs, Sound System"
                />
                {errors.itemName && (
                  <p className="text-sm text-destructive">{errors.itemName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="itemType">Item Type *</Label>
                <Select
                  value={formData.itemType}
                  onValueChange={(value) =>
                    handleInputChange("itemType", value)
                  }
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select an item type" />
                  </SelectTrigger>
                  <SelectContent>
                    {itemTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.itemType && (
                  <p className="text-sm text-destructive">{errors.itemType}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="borrowDate">Borrow Date *</Label>
                  <Input
                    id="borrowDate"
                    type="date"
                    value={formData.borrowDate}
                    onChange={(e) =>
                      handleInputChange("borrowDate", e.target.value)
                    }
                    disabled={isSubmitting}
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.borrowDate && (
                    <p className="text-sm text-destructive">
                      {errors.borrowDate}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expectedReturnDate">Expected Return *</Label>
                  <Input
                    id="expectedReturnDate"
                    type="date"
                    value={formData.expectedReturnDate}
                    onChange={(e) =>
                      handleInputChange("expectedReturnDate", e.target.value)
                    }
                    disabled={isSubmitting}
                    min={
                      formData.borrowDate ||
                      new Date().toISOString().split("T")[0]
                    }
                  />
                  {errors.expectedReturnDate && (
                    <p className="text-sm text-destructive">
                      {errors.expectedReturnDate}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity *</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    handleInputChange("quantity", parseInt(e.target.value) || 1)
                  }
                  disabled={isSubmitting}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">{errors.quantity}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose *</Label>
                <Textarea
                  id="purpose"
                  rows={3}
                  value={formData.purpose}
                  onChange={(e) => handleInputChange("purpose", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Describe the purpose of borrowing"
                />
                {errors.purpose && (
                  <p className="text-sm text-destructive">{errors.purpose}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  disabled={isSubmitting}
                  placeholder="Any additional information"
                />
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowModal(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Services;
