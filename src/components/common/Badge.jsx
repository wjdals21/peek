const colorMap = {
  blue: 'badge-blue',
  green: 'badge-green',
  amber: 'badge-amber',
  red: 'badge-red',
  gray: 'badge-gray',
}

export function Badge({ children, color = 'blue', icon }) {
  return (
    <span className={`badge ${colorMap[color]}`}>
      {icon && <i className={`ti ${icon} text-2xs`} />}
      {children}
    </span>
  )
}

export function Tag({ children }) {
  return <span className="tag">{children}</span>
}
