import semver from 'semver'

export default function minForRange (range) {
  return minForRangeHelper('0.0.0', range)
}

function dots (major, minor, patch) {
  return `${major}.${minor}.${patch}`
}

const max = 999999

export function minForRangeHelper (current, range) {
  let major = semver.major(current)
  let minor = semver.minor(current)
  let patch = semver.patch(current)
  let down

  while (!semver.satisfies(dots(major, 0, 0), range)) {
    major++
  }

  down = Math.max(major - 1, 0)
  if (semver.satisfies(dots(down, max, max), range)) {
    major = down
  }

  while (!semver.satisfies(dots(major, minor, 0), range)) {
    minor++
  }

  down = Math.max(minor - 1, 0)
  if (semver.satisfies(dots(major, down, max), range)) {
    minor = down
  }

  while (!semver.satisfies(dots(major, minor, patch), range)) {
    patch++
  }

  down = Math.max(patch - 1, 0)
  if (semver.satisfies(dots(major, minor, down), range)) {
    patch = down
  }

  return dots(major, minor, patch)
}
