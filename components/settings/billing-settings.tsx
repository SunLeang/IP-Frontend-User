"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Download, Plus } from "lucide-react";
import { SettingsHeader } from "./settings-header";

export function BillingSettings() {
  const paymentMethods = [
    {
      id: 1,
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true,
    },
    {
      id: 2,
      type: "Mastercard",
      last4: "8888",
      expiry: "03/26",
      isDefault: false,
    },
  ];

  const invoices = [
    {
      id: "INV-001",
      date: "2024-01-15",
      amount: "$29.99",
      status: "Paid",
    },
    {
      id: "INV-002",
      date: "2024-02-15",
      amount: "$29.99",
      status: "Paid",
    },
  ];

  return (
    <div>
      <SettingsHeader
        title="Billing & Payments"
        description="Manage your payment methods and billing history"
      />

      <div className="p-8 space-y-8">
        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Payment Methods
                </CardTitle>
                <CardDescription>
                  Manage your saved payment methods
                </CardDescription>
              </div>
              <Button className="flex items-center gap-2">
                <Plus size={16} />
                Add Card
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-gray-100 rounded flex items-center justify-center">
                      <CreditCard size={16} className="text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {method.type} ending in {method.last4}
                      </p>
                      <p className="text-sm text-gray-600">
                        Expires {method.expiry}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {method.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
            <CardDescription>
              Download your past invoices and receipts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {invoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{invoice.id}</p>
                    <p className="text-sm text-gray-600">{invoice.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-medium">{invoice.amount}</p>
                    <Badge
                      variant="secondary"
                      className="bg-green-100 text-green-800"
                    >
                      {invoice.status}
                    </Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                    >
                      <Download size={14} />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Current Plan */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>You are currently on the Pro plan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
              <div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Pro Plan
                </h3>
                <p className="text-blue-700">$29.99/month</p>
                <p className="text-sm text-blue-600 mt-1">
                  Next billing date: March 15, 2024
                </p>
              </div>
              <Button variant="outline">Manage Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
