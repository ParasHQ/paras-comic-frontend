import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import CommentListModal from 'components/Comment/CommentListModal'
import useStore from 'lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'components/Common/Head'
import { BounceLoader } from 'react-spinners'
import BuyChapterModal from 'components/Modal/BuyChapterModal'

const ChapterView = () => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(true)
  const [chapterData, setChapterData] = useState(null)
  const [chapterPageUrl, setChapterPageUrl] = useState([])
  const [hasNext, setHasNext] = useState(null)

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
    if (comicId && chapterId) {
      setChapterPageUrl([])
      fetchChapterData(comicId, chapterId)
    }
  }, [chapterId, comicId])

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
    if (_chapterData && _chapterData.status === 'read') {
      fetchChapterPage(_chapterData.metadata.page_count, comicId, chapterId)
    }
  }

  const fetchChapterPage = async (numPage, comicId, chapterId) => {
    console.log(numPage)
    let url = []
    for (let i = 1; i <= numPage; i++) {
      url.push(
        `${process.env.COMIC_API_URL}/pages/${comicId}/${chapterId}/${i}`
      )
    }
    setChapterPageUrl(url)
  }

  console.log('hasnext', hasNext)

  return (
    <Layout showNav={false} showFooter={false} className="bg-black">
      <Head />
      <MenuTop ref={menuTopRef} showMenu={showMenu} data={chapterData} />
      <MenuBottom
        ref={menuBottomRef}
        showMenu={showMenu}
        data={chapterData}
        hasNext={hasNext}
      />
      <div className="max-w-xl m-auto relative">
        {chapterPageUrl.map((url, i) => (
          <ChapterImagePage key={i} url={url} />
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

const ChapterImagePage = ({ url }) => {
  const [imageCh, setImageCh] = useState('')
  const [unauthorized, setUnauthorized] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(url, {
          responseType: 'blob',
        })
        const objectUrl = URL.createObjectURL(response.data)
        setImageCh([objectUrl])
      } catch (error) {
        setUnauthorized(true)
      }
    }
    fetchImage()
  }, [url])

  if (unauthorized) return null

  return imageCh !== '' ? (
    <div className="">
      <img src={imageCh} />
      <div className="absolute inset-0 bg-transparent z-0" />
    </div>
  ) : (
    <div className="h-96 flex justify-center items-center gray">
      <BounceLoader loading={true} color={'rgb(107, 114, 128)'} size={24} />
    </div>
  )
}