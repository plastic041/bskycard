import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ type, ...props }, ref) => {
    return (
      <input
        type={type}
        className="flex h-10 w-full rounded-sm border border-gray-200 bg-white px-3 py-2 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
