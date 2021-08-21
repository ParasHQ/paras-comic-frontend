import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconXCircle } from 'components/Icons'
import near from 'lib/near'

const LoginModal = ({ show, onClose }) => {
  return (
    <Modal isShow={show} close={onClose}>
      <div className="max-w-sm m-4 md:m-auto relative bg-blueGray-800 px-4 py-8 text-center rounded-md">
        <div
          className="flex-1 h-48 md:h-64 mb-4"
          style={{
            backgroundImage:
              'url("https://ipfs.fleek.co/ipfs/bafybeifcszvyf5rkpjzuugjejdj3g4jbizzedq7yprbu33s3eokvyd6tbm")',
            backgroundPositionX: 'right',
            backgroundSize: 'contain',
            backgroundRepeat: 'no-repeat',
          }}
        />
        <h3 className="mb-4 text-2xl text-white font-semibold">
          Login to buy this chapter
        </h3>
        <p className="mt-1 text-white opacity-80">
          Read and truly own your digital comics. Interact, engage, and support
          the creators through collectibles NFTs.
        </p>
        <div className="mt-4">
          <Button size="lg" onClick={() => near.signIn()}>
            Login
          </Button>
        </div>
        <div
          className="absolute -top-4 -right-4 cursor-pointer"
          onClick={onClose}
        >
          <IconXCircle size={32} />
        </div>
      </div>
    </Modal>
  )
}

export default LoginModal