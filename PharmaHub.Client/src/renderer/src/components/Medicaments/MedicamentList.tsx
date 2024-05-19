import { useCallback, useMemo, useRef } from 'react'
import { useSearch } from '@tanstack/react-router'
import { useMedicaments } from '@renderer/services/medicaments.service'
import MedicamentCard from './MedicamentCard'
import MedicamentsFilter from './MedicamentsFilter'

function MedicamentList() {
  const search = useSearch({ from: '/_portal/medicaments' })
  const observer = useRef<IntersectionObserver>()

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage, isLoading } =
    useMedicaments({
      name: search.name
    })

  const medicaments = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data]
    }, [])
  }, [data])

  const lastElementRef = useCallback(
    (element: HTMLDivElement | null) => {
      if (isLoading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage()
        }
      })

      if (element) observer.current.observe(element)
    },
    [fetchNextPage, hasNextPage, isFetching, isLoading]
  )

  return (
    <div>
      <MedicamentsFilter />
      {medicaments &&
        medicaments.map((medicament) => (
          <MedicamentCard key={medicament.id} medicament={medicament} ref={lastElementRef} />
        ))}
      {isFetchingNextPage && <div style={{ textAlign: 'center' }}>Fetching more data...</div>}
      <div style={{ textAlign: 'center' }}>
        {isFetching && !isFetchingNextPage ? 'Fetching...' : null}
      </div>
    </div>
  )
}

export default MedicamentList
