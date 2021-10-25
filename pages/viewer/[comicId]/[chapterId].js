import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Common/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import CommentListModal from 'components/Comment/CommentListModal'
import useStore from 'lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'components/Common/Head'
import BuyChapterModal from 'components/Modal/BuyChapterModal'
import ChapterImagePage from 'components/ViewerMenu/ChapterImagePage'
import ChapterNotAvailableModal from 'components/Modal/ChapterNotAvailableModal'

const ChapterView = ({ isLoading }) => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(true)
  const [chapterData, setChapterData] = useState(null)
  const [chapterPageUrl, setChapterPageUrl] = useState([])
  const [hasNext, setHasNext] = useState(null)
  const [activeLang, setActiveLang] = useState('en')

  const showComment = useStore((state) => state.showComment)

  const { comicId, chapterId } = router.query

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        menuTopRef.current &&
        menuBottomRef.current &&
        !menuTopRef.current.contains(event.target) &&
        !menuBottomRef.current.contains(event.target) &&
        !showComment &&
        chapterData?.status === 'read'
      ) {
        setShowMenu(!showMenu)
      }
    }

    const handleScroll = () => {
      if (!showComment) {
        setShowMenu(false)
      }
    }

    document.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutsideMenu)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [menuTopRef, menuBottomRef, showMenu, showComment, chapterData?.status])

  useEffect(() => {
    if (comicId && chapterId && !isLoading) {
      setChapterPageUrl([])
      fetchChapterData(comicId, chapterId)
    }
  }, [chapterId, comicId, isLoading])

  useEffect(() => {
    if (
      chapterData &&
      chapterData.status === 'read' &&
      chapterData.lang &&
      activeLang
    ) {
      fetchChapterPage(chapterData.lang[activeLang], comicId, chapterId)
    }
  }, [chapterData, activeLang])

  const fetchChapterData = async (comicId, chapterId) => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: comicId,
        chapter_ids: [chapterId, parseInt(chapterId) + 1],
      },
    })
    setHasNext(response.data.data.results.length > 1)

    const _chapterData = response.data.data.results[0]
    setChapterData(_chapterData || null)
  }

  const fetchChapterPage = async (numPage, comicId, chapterId) => {
    let url = []
    for (let i = 1; i <= numPage; i++) {
      url.push(
        `${process.env.COMIC_API_URL}/pages/${comicId}/${chapterId}/${i}/${activeLang}`
      )
    }
    setChapterPageUrl(url)
  }

  return (
    <Layout showNav={false} showFooter={false} className="bg-black">
      <Head />
      <ChapterNotAvailableModal
        show={
          chapterData &&
          chapterData.lang &&
          Object.keys(chapterData.lang).length === 0
        }
      />
      <MenuTop
        ref={menuTopRef}
        showMenu={showMenu}
        data={chapterData}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
      <MenuBottom
        ref={menuBottomRef}
        showMenu={showMenu}
        data={chapterData}
        hasNext={hasNext}
      />
      <div className="max-w-xl m-auto relative">
        {chapterPageUrl.map((url) => (
          <ChapterImagePage key={url} url={url} />
        ))}
      </div>
      <BuyChapterModal
        active={chapterData?.status !== 'read' || false}
        data={chapterData}
        hideCloseButton={true}
      />
      <CommentListModal />
    </Layout>
  )
}

export default ChapterView
