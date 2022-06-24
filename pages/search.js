import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Nav from 'components/Common/Nav'
import Head from 'components/Common/Head'
import ComicList from 'components/Comic/ComicList'
import ChapterListMarket from 'components/Chapter/ChapterListMarket'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import Footer from 'components/Common/Footer'

const LIMIT = 8
const LIMIT_PUBLICATION = 6

const EmptySearch = ({ active }) => {
  return (
    <div className="m-auto text-2xl text-gray-300 font-semibold py-32 text-center">
      <div className="w-40 m-auto">
        <img src="/cardstack.png" className="opacity-75" />
      </div>
      <p className="mt-4">
        {active === 'comics'
          ? 'No results found in Comics'
          : 'No results found in Chapters'}
      </p>
    </div>
  )
}

const Search = () => {
  const [activeTab, setActiveTab] = useState('comics')

  const [comics, setComics] = useState([])
  const [isFetchComic, setIsFetchComic] = useState(false)
  const [pageComic, setPageComic] = useState(0)
  const [comicHasMore, setComicHasMore] = useState(true)

  const [chapters, setChapters] = useState([])
  const [isFetchChap, setIsFetchChap] = useState(false)
  const [pageChap, setPageChap] = useState(0)
  const [chapHasMore, setChapHasMore] = useState(true)

  const [publications, setPublications] = useState([])
  const [isFetchPub, setIsFetchPub] = useState(false)
  const [pagePub, setPagePub] = useState(0)
  const [pubHasMore, setPubHasMore] = useState(true)

  const router = useRouter()

  useEffect(() => {
    fetchDataComic(true)
    fetchDataChap(true)
    fetchDataPub(true)
  }, [router])

  const fetchDataComic = async (initial) => {
    const _comics = initial ? [] : comics
    const _pageComic = initial ? 0 : pageComic
    const _hasMore = initial ? true : comicHasMore

    if (!_hasMore || isFetchComic) {
      return
    }

    setIsFetchComic(true)

    const params = {
      search: router.query.q,
      __skip: _pageComic * LIMIT,
      __limit: LIMIT,
    }

    const resp = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params,
    })
    const newDataComic = resp.data.data

    const newComics = [..._comics, ...newDataComic.results]

    setComics(newComics)
    setPageComic(_pageComic + 1)

    if (newDataComic.results.length < LIMIT) {
      setComicHasMore(false)
    } else {
      setComicHasMore(true)
    }

    setIsFetchComic(false)
  }

  const fetchDataChap = async (initial) => {
    const _chapters = initial ? [] : chapters
    const _pageChap = initial ? 0 : pageChap
    const _chapHasMore = initial ? true : chapHasMore

    if (!_chapHasMore || isFetchChap) {
      return
    }

    setIsFetchChap(true)

    const params = {
      search: router.query.q,
      __skip: _pageChap * LIMIT,
      __limit: LIMIT,
    }

    const resp = await axios.get(`${process.env.COMIC_API_URL}/token-series`, {
      params,
    })
    const newDataChapter = resp.data.data
    const newChapters = [..._chapters, ...newDataChapter.results]

    setChapters(newChapters)
    setPageChap(_pageChap + 1)

    if (newDataChapter.results.length < LIMIT) {
      setChapHasMore(false)
    } else {
      setChapHasMore(true)
    }

    setIsFetchChap(false)
  }

  const fetchDataPub = async (initial) => {
    const _publications = initial ? [] : publications
    const _pagePub = initial ? 0 : pagePub
    const _pubHasMore = initial ? true : pubHasMore

    if (!_pubHasMore || isFetchPub) {
      return
    }

    setIsFetchPub(true)

    const params = {
      isComic: true,
      search: router.query.q,
      __skip: _pagePub * LIMIT_PUBLICATION,
      __limit: LIMIT_PUBLICATION,
    }

    const resp = await axios.get(`${process.env.PARAS_API_URL}/publications`, {
      params,
    })
    const newDataPub = resp.data.data
    const newPublications = [..._publications, ...newDataPub.results]

    setPublications(newPublications)
    setPagePub(_pagePub + 1)

    if (newDataPub.results.length < LIMIT_PUBLICATION) {
      setPubHasMore(false)
    } else {
      setPubHasMore(true)
    }

    setIsFetchPub(false)
  }

  return (
    <>
      <Nav />
      <Head title="Search" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <div className="text-center">
          <p className="text-3xl font-bold">Search Result</p>
          <p className="text-xl font-bold text-gray-500">
            for <span className="text-primary underline">{router.query.q}</span>
          </p>
        </div>
        <div className="flex justify-center md:justify-start gap-10 text-lg font-bold mt-4">
          <div>
            <p
              className={`cursor-pointer hover:text-gray-700 ${
                activeTab === 'comics' && 'text-gray-700'
              }`}
              onClick={() => setActiveTab('comics')}
            >
              Comics
            </p>
            {activeTab === 'comics' && <div className="w-10 py-1 bg-primary" />}
          </div>
          <div>
            <p
              className={`cursor-pointer hover:text-gray-700 ${
                activeTab === 'chapters' && 'text-gray-700'
              }`}
              onClick={() => setActiveTab('chapters')}
            >
              Chapters
            </p>
            {activeTab === 'chapters' && (
              <div className="w-10 py-1 bg-primary" />
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer hover:text-gray-700 ${
                activeTab === 'publications' && 'text-gray-700'
              }`}
              onClick={() => setActiveTab('publications')}
            >
              Publications
            </p>
            {activeTab === 'publications' && (
              <div className="w-10 py-1 bg-primary" />
            )}
          </div>
        </div>
        <div className="mt-10">
          {activeTab === 'comics' && (
            <>
              <ComicList
                comics={comics}
                hasMore={comicHasMore}
                fetchComics={fetchDataComic}
              />
              {comics.length === 0 && <EmptySearch active={activeTab} />}
            </>
          )}
          {activeTab === 'chapters' && (
            <>
              <ChapterListMarket
                tokens={chapters}
                hasMore={chapHasMore}
                fetchTokens={fetchDataChap}
              />
              {chapters.length === 0 && <EmptySearch active={activeTab} />}
            </>
          )}
          {activeTab === 'publications' && (
            <>
              <PublicationListScroll
                data={publications}
                hasMore={pubHasMore}
                fetchData={fetchDataPub}
                type="search"
              />
            </>
          )}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Search
