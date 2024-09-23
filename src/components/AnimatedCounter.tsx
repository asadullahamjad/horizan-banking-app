'use client'
import React from "react";
import CountUp from "react-countup";
const AnimatedCounter = ({ amount }: { amount: number }) => {
  return (
    <div className="w-full text-center">
      <CountUp
        end={amount}
        duration={1.5}
        decimals={2}
        decimal=","
        prefix="$"
      />
    </div>
  );
};

export default AnimatedCounter;
