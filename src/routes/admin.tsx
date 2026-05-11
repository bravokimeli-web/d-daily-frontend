import { createFileRoute, Link } from "@tanstack/react-router";
import { hasAdminAccess, getAdminEmail, clearAdminEmail, ADMIN_EMAIL_PUBLIC } from "@/lib/admin";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { BarChart3, LogOut, Package, ShoppingCart, Users, Settings, Upload, Trash2, Eye, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin")({
  component: () => {
    const isAdmin = hasAdminAccess();
    const adminEmail = getAdminEmail();
    const [activeTab, setActiveTab] = useState<"dashboard" | "products" | "orders" | "resellers" | "settings">("dashboard");
    const [products, setProducts] = useState<any[]>([]);
    const [orders, setOrders] = useState<any[]>([]);
    const [resellers, setResellers] = useState<any[]>([]);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [dropActive, setDropActive] = useState(false);
    const [loadingResellers, setLoadingResellers] = useState(false);
    const [resellerFilter, setResellerFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

    // Fetch resellers on mount and when filter changes
    useEffect(() => {
      if (!isAdmin) return;

      const fetchResellers = async () => {
        setLoadingResellers(true);
        try {
          const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
          const url = new URL(`${baseURL}/admin/resellers`);
          if (resellerFilter !== "all") {
            url.searchParams.append("status", resellerFilter);
          }

          const response = await fetch(url.toString(), {
            headers: { 
              "x-admin-email": adminEmail || "",
            },
          });

          if (!response.ok) throw new Error("Failed to fetch resellers");
          const data = await response.json();
          setResellers(data.data || []);
        } catch (err) {
          console.error("Error fetching resellers:", err);
          toast.error("Failed to load reseller applications");
        } finally {
          setLoadingResellers(false);
        }
      };

      fetchResellers();
    }, [isAdmin, resellerFilter, adminEmail]);

    const handleResellerStatus = async (resellerId: string, status: "approved" | "rejected", notes?: string) => {
      try {
        const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
        const response = await fetch(`${baseURL}/admin/resellers/${resellerId}/status`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-email": adminEmail || "",
          },
          body: JSON.stringify({ status, notes }),
        });

        if (!response.ok) throw new Error("Failed to update reseller");
        const data = await response.json();
        setResellers(resellers.map((r) => (r._id === resellerId ? data.data : r)));
        toast.success(`Reseller ${status}`);
      } catch (err) {
        toast.error((err as Error).message);
      }
    };

    if (!isAdmin) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="mt-4 text-sm text-muted-foreground">
              Enter your admin email to access the dashboard.
            </p>
            <div className="mt-8">
              <AdminLoginForm />
            </div>
            <div className="mt-8">
              <Link
                to="/"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const handleLogout = () => {
      clearAdminEmail();
      window.location.href = "/";
    };

    const handleImageSelected = (file: File | null) => {
      if (!file) {
        setImageFile(null);
        setImagePreview(null);
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    };

    const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!imageFile) return;

      const formData = new FormData(e.currentTarget);
      const newProduct = {
        id: Date.now(),
        name: formData.get("name"),
        slug: (formData.get("name") as string)?.toLowerCase().replace(/\s+/g, "-"),
        price: parseFloat(formData.get("price") as string),
        image: imagePreview,
        category: formData.get("category"),
        description: formData.get("description"),
      };
      setProducts([...products, newProduct]);
      (e.target as HTMLFormElement).reset();
      setImageFile(null);
      setImagePreview(null);
    };

    const handleDeleteProduct = (id: number) => {
      setProducts(products.filter((p) => p.id !== id));
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropActive(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageSelected(file);
      }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDropActive(true);
    };

    const handleDragLeave = () => {
      setDropActive(false);
    };

    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border">
          <div className="container-px mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
                  <p className="text-sm text-muted-foreground">{adminEmail}</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-border">
          <div className="container-px mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1">
              {[
                { id: "dashboard", label: "Dashboard", icon: BarChart3 },
                { id: "products", label: "Products", icon: Package },
                { id: "orders", label: "Orders", icon: ShoppingCart },
                { id: "resellers", label: "Resellers", icon: Users },
                { id: "settings", label: "Settings", icon: Settings },
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 flex items-center gap-2 transition-colors ${
                    activeTab === id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="container-px mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Orders</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{orders.length}</p>
                  </div>
                  <ShoppingCart className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Reseller Applications</p>
                    <p className="mt-2 text-3xl font-bold text-foreground">{resellers.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </div>

              <div className="rounded-lg border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Admin Account</p>
                    <p className="mt-2 text-sm font-mono text-primary">{adminEmail}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
            </div>
          )}

          {/* Products Tab */}
          {activeTab === "products" && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="rounded-lg border border-border bg-card p-6 space-y-4 max-w-2xl">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium">Product Name</label>
                      <input
                        name="name"
                        placeholder="e.g., Insecticide Spray"
                        className="mt-2 w-full h-10 px-3 rounded-lg border border-input bg-background"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Price (KES)</label>
                      <input
                        name="price"
                        type="number"
                        placeholder="0.00"
                        step="0.01"
                        className="mt-2 w-full h-10 px-3 rounded-lg border border-input bg-background"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <select
                      name="category"
                      className="mt-2 w-full h-10 px-3 rounded-lg border border-input bg-background"
                      required
                    >
                      <option value="">Select category</option>
                      <option value="pest-control">Pest Control</option>
                      <option value="lighting">Lighting</option>
                      <option value="home-protection">Home Protection</option>
                      <option value="farm-protection">Farm Protection</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <textarea
                      name="description"
                      placeholder="Product description and details"
                      rows={3}
                      className="mt-2 w-full px-3 py-2 rounded-lg border border-input bg-background"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Product image</label>
                    <div
                      className={`mt-2 rounded-2xl border-2 border-dashed p-5 text-center transition-colors ${
                        dropActive ? "border-primary bg-primary/5" : "border-input bg-background"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        id="product-image"
                        name="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(event) => {
                          handleImageSelected(event.target.files?.[0] ?? null);
                        }}
                      />
                      <label htmlFor="product-image" className="cursor-pointer block">
                        {imagePreview ? (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="mx-auto h-40 w-auto rounded-xl object-cover"
                          />
                        ) : (
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <p className="font-semibold text-foreground">Drag & drop an image or tap to upload</p>
                            <p>Supported formats: JPG, PNG, WEBP</p>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Add Product
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Products ({products.length})</h2>
                {products.length === 0 ? (
                  <p className="text-muted-foreground">No products added yet.</p>
                ) : (
                  <div className="space-y-2">
                    {products.map((p) => (
                      <div key={p.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                        <div className="flex-1">
                          <p className="font-medium">{p.name}</p>
                          <p className="text-sm text-muted-foreground">{p.category} • KES {p.price}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.id)}
                          className="inline-flex items-center gap-2 rounded-lg border border-destructive/30 px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Orders</h2>
              {orders.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 rounded-lg border border-border bg-card">
                      <div className="flex-1">
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-muted-foreground">{order.date}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Resellers Tab */}
          {activeTab === "resellers" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-foreground mb-4">Reseller Applications</h2>
                <div className="flex gap-2 mb-4">
                  {(["all", "pending", "approved", "rejected"] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setResellerFilter(filter)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        resellerFilter === filter
                          ? "bg-primary text-primary-foreground"
                          : "border border-border bg-card text-foreground hover:bg-accent"
                      }`}
                    >
                      {filter.charAt(0).toUpperCase() + filter.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {loadingResellers ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Loading...</p>
                </div>
              ) : resellers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-border p-12 text-center">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No {resellerFilter !== "all" ? resellerFilter : ""} reseller applications</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {resellers.map((reseller: any) => (
                    <div key={reseller._id} className="rounded-lg border border-border bg-card p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-foreground">{reseller.full_name}</h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              reseller.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : reseller.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {reseller.status.charAt(0).toUpperCase() + reseller.status.slice(1)}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{reseller.email}</p>
                          <p className="text-sm text-muted-foreground">{reseller.phone}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {new Date(reseller.appliedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Documents */}
                      {Object.entries(reseller.documents || {}).some(([_, value]) => value) && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-sm font-semibold text-foreground mb-3">Documents</p>
                          <div className="grid grid-cols-2 gap-2">
                            {reseller.documents?.id_front && (
                              <a
                                href={reseller.documents.id_front}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                              >
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate">ID Front</span>
                              </a>
                            )}
                            {reseller.documents?.id_back && (
                              <a
                                href={reseller.documents.id_back}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                              >
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate">ID Back</span>
                              </a>
                            )}
                            {reseller.documents?.kra_pin && (
                              <a
                                href={reseller.documents.kra_pin}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                              >
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate">KRA PIN</span>
                              </a>
                            )}
                            {reseller.documents?.additional && (
                              <a
                                href={reseller.documents.additional}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background hover:bg-accent transition-colors"
                              >
                                <FileText className="h-4 w-4 text-primary" />
                                <span className="text-sm truncate">Additional</span>
                              </a>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {reseller.status === "pending" && (
                        <div className="flex gap-2 pt-4 border-t border-border">
                          <Button
                            size="sm"
                            onClick={() => handleResellerStatus(reseller._id, "approved")}
                            className="flex-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleResellerStatus(reseller._id, "rejected")}
                            className="flex-1"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {reseller.notes && (
                        <div className="pt-4 border-t border-border">
                          <p className="text-xs font-semibold text-muted-foreground mb-1">Admin Notes</p>
                          <p className="text-sm text-muted-foreground">{reseller.notes}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="max-w-2xl">
              <h2 className="text-xl font-bold text-foreground mb-4">Admin Settings</h2>
              <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                <div>
                  <label className="text-sm font-medium text-foreground">Admin Email</label>
                  <p className="mt-2 h-10 px-3 rounded-lg border border-input bg-background flex items-center text-sm">
                    {adminEmail}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Site Settings</label>
                  <p className="mt-2 text-sm text-muted-foreground">More settings coming soon</p>
                </div>

                <div className="pt-4 border-t border-border">
                  <Button variant="destructive" onClick={handleLogout} className="w-full">
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout from Admin
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  },
});
