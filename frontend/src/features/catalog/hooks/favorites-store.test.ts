import { favoritesStore } from './favorites-store'

const STORAGE_KEY = 'cupcakes-gourmet.favorites'

describe('favoritesStore', () => {
  afterEach(() => favoritesStore.clear())

  it('marks and unmarks a product', () => {
    favoritesStore.toggle(4)
    expect(favoritesStore.has(4)).toBe(true)

    favoritesStore.toggle(4)
    expect(favoritesStore.has(4)).toBe(false)
  })

  it('keeps the favorites in the browser across visits', () => {
    favoritesStore.toggle(4)
    favoritesStore.toggle(9)

    expect(localStorage.getItem(STORAGE_KEY)).toBe('[4,9]')
    favoritesStore.reload()
    expect(favoritesStore.get()).toEqual([4, 9])
  })

  it('ignores unreadable stored data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json')

    favoritesStore.reload()

    expect(favoritesStore.get()).toEqual([])
  })

  it('keeps working when the browser storage is unavailable', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage disabled')
    })

    favoritesStore.toggle(7)

    expect(favoritesStore.has(7)).toBe(true)
  })
})
