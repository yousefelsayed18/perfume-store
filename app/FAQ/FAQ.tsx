"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I place an order?",
    answer: "You can place an order by browsing our collection, selecting your preferred fragrance, and proceeding to checkout.",
  },
  {
    question: "Why do you require a shipping deposit to confirm the order?",
    answer: "We require a shipping deposit to confirm orders and ensure serious buyers, which helps us maintain quality service.",
  },
  {
    question: "Is the shipping deposit refundable?",
    answer: "Yes, the shipping deposit is fully refundable if you cancel before the order is shipped.",
  },
  {
    question: "How long does delivery take?",
    answer: "Delivery typically takes 3-7 business days depending on your location.",
  },
  {
    question: "Will I receive a tracking number?",
    answer: "Yes, once your order is shipped you will receive a tracking number via email or SMS.",
  },
  {
    question: "Can I change my address or phone number after ordering?",
    answer: "You can change your details within 24 hours of placing the order by contacting our support team.",
  },
  {
    question: "Can I cancel my order?",
    answer: "Orders can be cancelled within 24 hours of placement. After that, cancellations are subject to review.",
  },
  {
    question: "Do you accept returns or exchanges?",
    answer: "We accept returns or exchanges for defective products within 7 days of delivery.",
  },
  {
    question: 'What counts as a "defective" product?',
    answer: "A defective product includes damaged packaging, incorrect item, or any manufacturing defect.",
  },
  {
    question: "What should I do if my order arrives damaged or incorrect?",
    answer: "Please contact us immediately with photos of the damaged or incorrect item and we will resolve it promptly.",
  },
  {
    question: "Where are ELDORA materials sourced from?",
    answer: "ELDORA sources its materials from premium suppliers across France, the Middle East, and beyond.",
  },
];

export default function FAQ() {
  return (
    <section className="w-[90%] mx-auto py-16">
      <h2 className="text-2xl font-bold mb-8">Frequently asked questions</h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-300"
          >
            <AccordionTrigger className="text-sm font-normal py-5 hover:no-underline text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-gray-600 pb-5">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}