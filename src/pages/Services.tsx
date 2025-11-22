import React, { useState, useEffect } from "react";
import {
  Plus,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  Settings,
  Search,
  Wrench,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  const [searchTerm, setSearchTerm] = useState("");
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
        label: string;
      }
    > = {
      pending: { variant: "outline", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      borrowed: { variant: "secondary", label: "Borrowed" },
      returned: { variant: "default", label: "Returned" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    return badges[status] || badges.pending;
  };

  const canEditItemTypes = user?.role === "admin" || user?.role === "staff";

  const filteredServices = services.filter(
    (service) =>
      service.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.itemType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.purpose.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="flex justify-between items-start gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold tracking-tight mb-2 flex items-center gap-3">
                <Wrench className="h-8 w-8 text-primary" />
                Borrow & Return Services
              </h1>
              <p className="text-muted-foreground text-lg">
                Request and track barangay services and equipment
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
                className="btn-glow hover-lift shadow-lg shadow-primary/20"
              >
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search service requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No service requests found"
            description={
              searchTerm
                ? "Try adjusting your search terms"
                : "No service requests yet"
            }
          />
        ) : (
          <div className="space-y-4 animate-in fade-in duration-700 delay-100">
            {filteredServices.map((service) => {
              const statusBadge = getStatusBadge(service.status);
              return (
                <Card key={service._id} className="glass-card card-hover">
                  <CardHeader>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <CardTitle className="text-xl mb-2">
                          {service.itemName}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {service.itemType}
                        </p>
                      </div>
                      <Badge variant={statusBadge.variant}>
                        {statusBadge.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{service.quantity}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Borrow:</span>
                        <span className="font-medium">
                          {format(new Date(service.borrowDate), "MMM dd, yyyy")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-muted-foreground">Return:</span>
                        <span className="font-medium">
                          {format(
                            new Date(service.expectedReturnDate),
                            "MMM dd, yyyy"
                          )}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">
                        Purpose
                      </p>
                      <p className="text-sm">{service.purpose}</p>
                    </div>
                    {service.notes && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <p className="text-sm text-muted-foreground mb-1">
                          Notes
                        </p>
                        <p className="text-sm">{service.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Item Type Management Modal */}
      {showItemTypeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>Manage Service Item Types</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Item Types (comma-separated)
                </label>
                <textarea
                  className="w-full p-3 border rounded-md resize-none"
                  rows={4}
                  value={newItemTypes}
                  onChange={(e) => setNewItemTypes(e.target.value)}
                  placeholder="e.g., equipment, facility, document, other"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  Current item types: {itemTypes.join(", ")}
                </p>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateItemTypes} className="flex-1">
                  Update Item Types
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowItemTypeModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Create Service Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto">
            <CardHeader>
              <CardTitle>New Service Request</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Item Name *
                  </label>
                  <Input
                    value={formData.itemName}
                    onChange={(e) =>
                      handleInputChange("itemName", e.target.value)
                    }
                    disabled={isSubmitting}
                    placeholder="e.g., Folding Chairs, Sound System"
                  />
                  {errors.itemName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.itemName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Item Type *
                  </label>
                  <select
                    className="w-full p-3 border rounded-md"
                    value={formData.itemType}
                    onChange={(e) =>
                      handleInputChange("itemType", e.target.value)
                    }
                    disabled={isSubmitting}
                  >
                    <option value="">Select an item type</option>
                    {itemTypes.map((type) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </option>
                    ))}
                  </select>
                  {errors.itemType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.itemType}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Borrow Date *
                    </label>
                    <Input
                      type="date"
                      value={formData.borrowDate}
                      onChange={(e) =>
                        handleInputChange("borrowDate", e.target.value)
                      }
                      disabled={isSubmitting}
                      min={new Date().toISOString().split("T")[0]}
                    />
                    {errors.borrowDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.borrowDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Expected Return *
                    </label>
                    <Input
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
                      <p className="text-red-500 text-xs mt-1">
                        {errors.expectedReturnDate}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Quantity *
                  </label>
                  <Input
                    type="number"
                    min="1"
                    value={formData.quantity}
                    onChange={(e) =>
                      handleInputChange(
                        "quantity",
                        parseInt(e.target.value) || 1
                      )
                    }
                    disabled={isSubmitting}
                  />
                  {errors.quantity && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.quantity}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Purpose *
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={3}
                    value={formData.purpose}
                    onChange={(e) =>
                      handleInputChange("purpose", e.target.value)
                    }
                    disabled={isSubmitting}
                    placeholder="Describe the purpose of borrowing"
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.purpose}
                    </p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="w-full p-3 border rounded-md resize-none"
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => handleInputChange("notes", e.target.value)}
                    disabled={isSubmitting}
                    placeholder="Any additional information"
                  />
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowModal(false)}
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Services;
