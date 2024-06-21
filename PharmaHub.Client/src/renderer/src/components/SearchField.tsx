import { MultiSelect, Select } from '@mantine/core'
import { useDebouncedState } from '@mantine/hooks'
import { http } from '@renderer/utils/http'
import { useQuery } from '@tanstack/react-query'
import React, { useCallback, useEffect } from 'react'

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
  value: { value: string; label: string }
  setValue: (item: { value: string; label: string }) => void
}

type MultiSelectProps = {
  isMultiSelect: true
  value: string[]
  setValue: (items: string[]) => void
}

type SearchFieldProps = SearchFieldPropsBase &
  (MultiSelectProps | SingleSelectProps)

function SearchField(props: SearchFieldProps) {
  const {
    dataMapper,
    queryKey,
    queryParamName,
    searchUrl,
    isMultiSelect,
    label,
    error,
    value,
    setValue,
    ...rest
  } = props

  const [search, setSearch] = useDebouncedState('', 500)

  const fetchOptions = useCallback(async () => {
    const response = await http.get(searchUrl, {
      params: {
        [queryParamName]: search
      }
    })
    return response.data.data?.map(dataMapper)
  }, [search, searchUrl, queryParamName, dataMapper])

  const { data: options = [], isError } = useQuery({
    queryKey: [queryKey, search],
    queryFn: fetchOptions
  })

  const handleSearchChange = useCallback(
    (value) => {
      setSearch(value)
    },
    [setSearch]
  )

  useEffect(() => {
    if (!isMultiSelect && value) {
      setSearch(value.label)
    }
  }, [value, isMultiSelect])

  if (isError) {
    return <div>Error loading options...</div>
  }

  const commonProps = {
    label,
    clearable: true,
    onSearchChange: handleSearchChange,
    searchable: true,
    data: options,
    error,
    ...rest
  }

  return isMultiSelect ? (
    <MultiSelect
      {...commonProps}
      value={value}
      onChange={(values) => setValue(values)}
    />
  ) : (
    <Select
      {...commonProps}
      value={value?.value || ''}
      onChange={(value, item) => {
        console.log({ value, item })
        setValue(item)
      }}
    />
  )
}

export default React.memo(SearchField)
