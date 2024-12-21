import { cn } from "@/lib/utils";

interface ProductFormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ProductFormSection({
  title,
  description,
  children,
  className,
}: ProductFormSectionProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div>
        <h4 className="text-sm font-semibold leading-none">{title}</h4>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}
