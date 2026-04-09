"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <CheckCircle className="text-green-500 w-16 h-16" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">
          Order Placed Successfully 🎉
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase! Your order has been placed successfully.
          We’ll send you a confirmation email shortly.
        </p>

        {/* Order Info */}
        <div className="bg-gray-100 rounded-lg p-4 mb-6 text-sm text-gray-700">
     
          <p>
            <span className="font-semibold">Estimated Delivery:</span> 2-4 days
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 transition"
          >
            Continue Shopping
          </Link>


        </div>
      </div>
    </div>
  );
}