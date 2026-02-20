"use client";

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import { Divider } from "@nextui-org/divider";
import { CheckIcon, XIcon } from "lucide-react";
import clsx from "clsx";

const plans = [
    {
        name: "Starter",
        price: "Free",
        description: "Perfect for trying out our platform.",
        features: [
            { name: "5 Projects", included: true },
            { name: "Basic Analytics", included: true },
            { name: "Community Support", included: true },
            { name: "Custom Domain", included: false },
            { name: "Team Members", included: false },
        ],
        buttonText: "Get Started",
        isPopular: false,
    },
    {
        name: "Pro",
        price: "$29",
        period: "/mo",
        description: "Best for professionals and growing teams.",
        features: [
            { name: "Unlimited Projects", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "Priority Support", included: true },
            { name: "Custom Domain", included: true },
            { name: "5 Team Members", included: true },
        ],
        buttonText: "Upgrade to Pro",
        isPopular: true,
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "For large organizations with specific needs.",
        features: [
            { name: "Unlimited Projects", included: true },
            { name: "Advanced Analytics", included: true },
            { name: "24/7 Dedicated Support", included: true },
            { name: "Custom Domain", included: true },
            { name: "Unlimited Team Members", included: true },
        ],
        buttonText: "Contact Sales",
        isPopular: false,
    },
];

export default function PricingPage() {
    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="text-center space-y-2 mb-8">
                <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
                <p className="text-default-500 text-lg">Choose the plan that fits your needs.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto w-full px-4">
                {plans.map((plan) => (
                    <Card
                        key={plan.name}
                        className={clsx(
                            "border-none bg-background/60 dark:bg-default-100/50 backdrop-blur-lg shadow-sm p-4 relative overflow-visible",
                            plan.isPopular && "ring-2 ring-primary mt-4 md:mt-0 lg:mt-4"
                        )}
                    >
                        {plan.isPopular && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                Most Popular
                            </div>
                        )}
                        <CardHeader className="flex flex-col items-start gap-2 pb-6">
                            <h3 className="text-xl font-bold">{plan.name}</h3>
                            <p className="text-small text-default-500">{plan.description}</p>
                            <div className="flex items-baseline gap-1 mt-2">
                                <span className="text-4xl font-bold">{plan.price}</span>
                                {plan.period && <span className="text-default-500 font-medium">{plan.period}</span>}
                            </div>
                        </CardHeader>
                        <Divider />
                        <CardBody className="py-6">
                            <ul className="flex flex-col gap-3">
                                {plan.features.map((feature) => (
                                    <li key={feature.name} className="flex items-center gap-3">
                                        <div
                                            className={clsx(
                                                "p-1 rounded-full",
                                                feature.included ? "bg-success/10 text-success" : "bg-default-100 text-default-400"
                                            )}
                                        >
                                            {feature.included ? <CheckIcon size={14} /> : <XIcon size={14} />}
                                        </div>
                                        <span className={clsx("text-sm", !feature.included && "text-default-400")}>
                                            {feature.name}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </CardBody>
                        <CardFooter>
                            <Button
                                className="w-full"
                                color={plan.isPopular ? "primary" : "default"}
                                variant={plan.isPopular ? "solid" : "flat"}
                            >
                                {plan.buttonText}
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
