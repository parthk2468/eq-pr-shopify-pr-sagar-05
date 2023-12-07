import {Dialog, Transition} from '@headlessui/react';
import {useLoaderData} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {Fragment, useState} from 'react';

/**
 * A client component that defines a media gallery for hosting images, 3D models, and videos of products
 * @param {{
 *   media: MediaFragment[];
 *   className?: string;
 * }}
 */
export function ProductGallery({media, className}) {
  const {product} = useLoaderData();
  const {selectedVariant} = product;
  let [isOpen, setIsOpen] = useState(false);
  let [modalImage, setModalImage] = useState(selectedVariant?.image?.url);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  if (!media.length) {
    return null;
  }

  return (
    <div
      className={`swimlane md:grid-flow-row hiddenScroll md:p-0 md:overflow-x-auto md:grid-cols-2 ${className}`}
    >
      <>
        <Modal
          modalImage={modalImage}
          closeModal={closeModal}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <div className="md:col-span-2" key={selectedVariant?.image?.id}>
          {selectedVariant?.image && (
            <button
              className="w-full"
              onClick={() => {
                openModal();
                setModalImage(selectedVariant?.image?.url);
              }}
            >
              <Image
                loading={'lazy'}
                data={selectedVariant?.image}
                // aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                sizes={'(min-width: 48em) 60vw, 90vw'}
                className="object-cover w-full h-full aspect-square fadeIn"
              />
            </button>
          )}
        </div>
        {media.map((med, i) => {
          const isFirst = false;
          const isFourth = false;
          const isFullWidth = false;

          const image =
            med.__typename === 'MediaImage'
              ? {...med.image, altText: med.alt || 'Product image'}
              : null;

          const style = [
            isFullWidth ? 'md:col-span-2' : 'md:col-span-1',
            isFirst || isFourth ? '' : 'md:aspect-[4/5]',
            'aspect-square snap-center card-image bg-white dark:bg-contrast/10 w-mobileGallery md:w-full',
            selectedVariant?.image?.url == med.image?.url && '!hidden',
          ].join(' ');

          return (
            <button
              onClick={() => {
                openModal();
                setModalImage(image?.url);
              }}
              className={style}
              key={med.id || image?.id}
            >
              {image && (
                <Image
                  loading={'lazy'}
                  data={image}
                  aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                  sizes={
                    isFirst || isFourth
                      ? '(min-width: 48em) 60vw, 90vw'
                      : '(min-width: 48em) 30vw, 90vw'
                  }
                  className="object-cover w-full h-full aspect-square fadeIn"
                />
              )}
            </button>
          );
        })}
      </>
    </div>
  );
}

function Modal({setIsOpen, isOpen, closeModal, modalImage}) {
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <div className="mt-2">
                    <img
                      loading={'lazy'}
                      src={modalImage}
                      // aspectRatio={!isFirst && !isFourth ? '4/5' : undefined}
                      sizes={'(min-width: 48em) 60vw, 90vw'}
                      className="object-cover w-full h-full aspect-square fadeIn"
                      alt="zoom"
                    />
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      close!
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

/** @typedef {import('storefrontapi.generated').MediaFragment} MediaFragment */
