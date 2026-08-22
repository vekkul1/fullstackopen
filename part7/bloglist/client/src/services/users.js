const baseUrl = '/api/users'

const getAll = async () => {
  const response = await fetch(baseUrl)

  if (!response.ok) {
    throw new Error('Failed to fetch notes')
  }
  const x = await response.json()

  return x
}

export default { getAll }
