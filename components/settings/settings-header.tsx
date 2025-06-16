interface SettingsHeaderProps {
  title: string;
  description?: string;
}

export function SettingsHeader({ title, description }: SettingsHeaderProps) {
  return (
    <div className="border-b border-gray-200 px-8 py-6">
      <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
    </div>
  );
}