import InfiniteScroll from 'react-infinite-scroll-component'
import PublicationListLoader from './PublicationListLoader'
import PublicationList from './PublicationList'

const PublicationListScroll = ({ data, fetchData, hasMore, type }) => {
  if (data?.length === 0 && !hasMore) {
    return (
      <div className="w-full">
        <div
          className={`publication-card mx-4 md:w-1/2 md:mx-auto rounded-md overflow-hidden ${
            !type && 'border-dashed border-2 border-primary'
          }`}
        >
          <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
            <div className="w-40 m-auto">
              <img src="/cardstack.png" className="opacity-75" />
            </div>
            <p className="mt-4 text-gray-300">
              {type === 'search'
                ? 'No results found in Publication'
                : 'No Publication'}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <InfiniteScroll
      dataLength={data?.length || 4}
      next={fetchData}
      hasMore={hasMore}
      loader={<PublicationListLoader />}
    >
      <div className="flex flex-wrap">
        {data?.map((publication, idx) => (
          <div key={idx} className="w-full md:w-1/3 p-3">
            <PublicationList key={publication._id} data={publication} />
          </div>
        ))}
      </div>
    </InfiniteScroll>
  )
}
export default PublicationListScroll
