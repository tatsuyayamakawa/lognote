import { MobileMenuButton } from "./mobile-menu-button"

interface AdminPageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
}

export function AdminPageHeader({
  title,
  description,
  children,
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <MobileMenuButton />
        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          )}
        </div>
      </div>
      {children && <div className="flex gap-2">{children}</div>}
    </div>
  )
}
