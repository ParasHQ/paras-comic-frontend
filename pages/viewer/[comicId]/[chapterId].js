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
import Button from 'components/Common/Button'
import { IconLove } from 'components/Icons'
import ShareComponent from 'components/Common/ShareComponent'

const ChapterView = ({ isLoading }) => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const viewerRef = useRef()
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
        !menuTopRef?.current?.contains(event.target) &&
        !menuBottomRef?.current?.contains(event.target) &&
        viewerRef?.current?.contains(event.target) &&
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
  }, [
    menuTopRef,
    menuBottomRef,
    viewerRef,
    showMenu,
    showComment,
    chapterData?.status,
  ])

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

  const onClickLikes = () => {
    // TODO
  }

  return (
    <Layout showNav={false} showFooter={false} className="bg-white">
      <Head />
      <ChapterNotAvailableModal
        show={
          chapterData &&
          chapterData.lang &&
          Object.keys(chapterData.lang).length === 0
        }
      />
      <BuyChapterModal
        active={chapterData?.status !== 'read' || false}
        data={chapterData}
        hideCloseButton={true}
      />
      <CommentListModal />
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
      <div ref={viewerRef} className="min-h-screen">
        {chapterPageUrl.map((url) => (
          <ChapterImagePage key={url} url={url} />
        ))}
      </div>
      <div className="mt-8 mb-20 mx-4">
        <div className="flex items-center justify-center">
          <Button
            className="flex items-center mr-8"
            size="md"
            onClick={onClickLikes}
          >
            <IconLove color={'none'} />
            <div className="ml-3 text-white text-xl">Like</div>
          </Button>
          <div>
            <div>Share Now</div>
            <ShareComponent
              title="Read this comic"
              withText={false}
              shareUrl={
                typeof window !== 'undefined' ? window?.location?.href : ''
              }
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ChapterView
