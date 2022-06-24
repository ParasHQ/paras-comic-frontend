import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from 'components/Common/Loading'
import ToastProvider from 'hooks/useToast'
import Script from 'next/script'

import near from 'lib/near'
import * as gtag from 'lib/gtag'

import 'tailwindcss/tailwind.css'
import 'croppie/croppie.css'
import '../styles/globals.css'
import 'draft-js/dist/Draft.css'
import useStore from 'lib/store'
import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'
import { GTM_ID, pageview } from 'lib/gtm'
import RPCStatus from 'components/Common/RPCStatus'

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const { setCurrentUser } = useStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await near.init()
      const account = near.getAccount()
      if (account) {
        try {
          const response = await axios.get(
            `${process.env.PARAS_API_URL}/profiles?accountId=${account.accountId}`
          )
          const userProfileResults = response.data.data.results

          if (userProfileResults.length === 0) {
            const formData = new FormData()
            formData.append('bio', 'Citizen of Paras')
            formData.append('accountId', account.accountId)

            try {
              const resp = await axios.put(
                `${process.env.PARAS_API_URL}/profiles`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              )
              setCurrentUser(resp.data.data)
            } catch (err) {
              setCurrentUser({})
              sentryCaptureException(err)
            }
          } else {
            const userProfile = userProfileResults[0]
            setCurrentUser(userProfile)
          }
        } catch (err) {
          sentryCaptureException(err)
        }
      }
      setIsLoading(false)
    }
    init()
  }, [])

  return (
    <ToastProvider>
      {isLoading && (
        <div className="fixed inset-0 bg-background z-50">
          <Loading className="w-screen h-screen m-auto flex justify-center items-center" />
        </div>
      )}
      {/* Google Tag Manager - Global base code */}
      <Script
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer', '${GTM_ID}');
          `,
        }}
      />
      <Component {...pageProps} isLoading={isLoading} />
      <RPCStatus />
    </ToastProvider>
  )
}

export default App
