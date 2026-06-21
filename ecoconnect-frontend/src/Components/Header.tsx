type HeaderProps = {
  title: string
}

export default function Header({ title }: HeaderProps) {
  return <h2 className="text-xl flex justify-start font-bold text-gray-900 mb-6">{title}</h2>
}