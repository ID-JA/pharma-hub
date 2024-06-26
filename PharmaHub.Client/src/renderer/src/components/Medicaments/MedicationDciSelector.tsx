import { MultiSelect } from '@mantine/core'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

function MedicationDciSelector({
  defaultValue,
  onChange,
  ...props
}: {
  defaultValue?: string[]
  onChange: (value: string) => void
}) {
  const [selectedProduct, setSelectedProduct] = useState<string[]>(
    defaultValue || []
  )
  const [searchQuery, setSearchQuery] = useState('')
  const { data } = useQuery({
    queryKey: ['medication-dcis', searchQuery],
    queryFn: async () => {
      const response = await http.get('/api/dcis', {
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

  const handleProductChange = (value) => {
    setSelectedProduct(value)
    if (onChange) {
      onChange(value)
    }
  }

  return (
    <MultiSelect
      label="DCI"
      searchable
      onSearchChange={(searchValue) => handleSearch(searchValue)}
      data={data}
      onChange={handleProductChange}
      value={selectedProduct}
      {...props}
    />
  )
}

export default MedicationDciSelector
