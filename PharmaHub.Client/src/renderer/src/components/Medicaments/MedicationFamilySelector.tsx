import { Select } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function MedicationFamilySelector({
  defaultValue,
  onChange,
  ...props
}: {
  defaultValue?: string
  onChange: (value: string) => void
}) {
  const [selectedFamily, setSelectedFamily] = useState(defaultValue || '')
  const [searchQuery, setSearchQuery] = useState('')
  const { data } = useQuery({
    queryKey: ['medication-families', searchQuery],
    queryFn: async () => {
      const response = await http.get('/api/families', {
        params: { query: searchQuery }
      })
      return response.data.data.map((item) => ({
        label: item.name,
        value: item.name
      }))
    }
  })

  const handleSearch = (searchValue) => {
    setSearchQuery(searchValue)
  }

  const handleMedicationFamilyChange = (value) => {
    setSelectedFamily(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Select
      label="Famille"
      searchable
      onSearchChange={(searchValue) => handleSearch(searchValue)}
      data={data}
      onChange={handleMedicationFamilyChange}
      value={selectedFamily}
      {...props}
    />
  )
}

export default MedicationFamilySelector
