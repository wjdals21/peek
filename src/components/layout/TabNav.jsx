export default function TabNav({ tabs, activeTab, onTabChange }) {
  return (
    <nav className="flex border-b border-blue-100 px-4 bg-white">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`tab-item ${activeTab === tab.id ? 'tab-item-active' : ''}`}
        >
          <i className={`ti ${tab.icon} text-sm`} />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
