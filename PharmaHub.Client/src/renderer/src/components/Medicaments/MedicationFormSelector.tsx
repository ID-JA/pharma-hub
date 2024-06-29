import { Select } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function MedicationFormSelector({
  defaultValue,
  onChange,
  ...props
}: {
  defaultValue?: string
  onChange: (value: string) => void
}) {
  const [selectedForm, setSelectedForm] = useState(defaultValue || '')
  const [searchQuery, setSearchQuery] = useState('')
  const { data } = useQuery({
    queryKey: ['medication-forms', searchQuery],
    queryFn: async () => {
      const response = await http.get('/api/forms', {
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

  const handleMedicationFormChange = (value) => {
    setSelectedForm(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <Select
      label="Forme"
      searchable
      onSearchChange={(searchValue) => handleSearch(searchValue)}
      data={data}
      onChange={handleMedicationFormChange}
      value={selectedForm}
      {...props}
    />
  )
}

export default MedicationFormSelector
