export default function normalizeSemver(version) {
  version = `${version}`
  const dots = version.split('.')
  if (dots.length === 3) return version
  if (dots.length === 2) return `${version}.0`
  return `${version}.0.0`
}
