import Button from './Button'

export default function EmptyState({ icon = 'ti-inbox', title, description, action, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
      <i className={`ti ${icon} text-4xl text-blue-300`} />
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium text-blue-900">{title}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      {action && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {action}
        </Button>
      )}
    </div>
  )
}
