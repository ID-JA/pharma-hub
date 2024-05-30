import { MultiSelect, Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback } from 'react'

type SearchFieldPropsBase = {
  label: string
  searchUrl: string
  queryKey: string
  queryParamName: string
  dataMapper: (item: any) => { value: string; label: string }
  error?: any
}

type SingleSelectProps = {
  isMultiSelect?: false
  setValue: (item: { value: string; label: string }) => void
}

type MultiSelectProps = {
  isMultiSelect: true
  setValue: (items: string[]) => void
  // setValue: (item: { value: string; label: string }[]) => void
}
type SearchFieldProps = SearchFieldPropsBase &
  (MultiSelectProps | SingleSelectProps)

function SearchField(props) {
  const {
    dataMapper,
    queryKey,
    queryParamName,
    searchUrl,
    isMultiSelect,
    label,
    error,
    setValue,
    ...rest
  } = props
  const [search, setSearch] = useDebouncedState('', 500)

  const fetchOptions = useCallback(async () => {
    if (!search) return []
    const response = await http.get(searchUrl, {
      params: {
        [queryParamName]: search
      }
    })
    return response.data.data?.map(dataMapper)
  }, [search, searchUrl, queryParamName, dataMapper])

  const { data: options = [], isError } = useQuery({
    queryKey: [queryKey, search],
    queryFn: fetchOptions,
    enabled: !!search
  })

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value)
    },
    [setSearch]
  )

  if (isError) {
    return <div>Error loading options...</div>
  }

  const commonProps = {
    label,
    onSearchChange: handleSearchChange,
    searchable: true,
    data: options,
    error,
    ...rest
  }

  return isMultiSelect ? (
    <MultiSelect {...commonProps} onChange={(values) => setValue(values)} />
  ) : (
    <Select
      {...commonProps}
      defaultValue={search}
      onChange={(_, item) => setValue(item)}
    />
  )
}

export default React.memo(SearchField)
