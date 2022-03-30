import Link from 'next/link'
import { parseImgUrl } from 'utils/common'
import PublicationLoader from './PublicationLoader'

const PublicationFeatured = ({ data }) => {
  if (!data) return <PublicationLoader />

  return (
    <div className="publication-card rounded-md overflow-hidden shadow-xl drop-shadow-xl">
      <div className="relative z-10 bg-primary">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="aspect-[3/2] overflow-hidden m-auto cursor-pointer shadow-inner">
              <img
                className="aspect-[3/2] w-full object-cover"
                src={parseImgUrl(data.thumbnail, null, { width: `600` })}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-col p-4 -mt-1 h-32">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="cursor-pointer">
              <div className="overflow-hidden" style={{ maxHeight: `3.75rem` }}>
                <h1 className="text-black text-2xl font-bold line-clamp-2 border-b-2 border-transparent">
                  {data.title}
                </h1>
              </div>
              <div className="overflow-hidden mt-2">
                <p className="text-black line-clamp-2">{data.description}</p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

export default PublicationFeatured