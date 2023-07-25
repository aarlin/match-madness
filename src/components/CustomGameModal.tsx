'use client'
import { useCustomGameStore } from "@/lib/store";
import React from "react";
import { useClickOutside } from '@mantine/hooks';
import { useWindowEvent } from '@mantine/hooks';

export const CustomGameModal = () => {
  const showModal = useCustomGameStore((state) => state.showModal);
  const setShowModal = useCustomGameStore((state) => state.setShowModal);
  const modalRef = useClickOutside(() => setShowModal(false));
  useWindowEvent('keydown', (event) => {
    if (event.code === 'Escape') {
      event.preventDefault();
      setShowModal(false);
    }
  });

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Grayed-out background */}
          <div className="fixed inset-0 bg-gray-900 opacity-50"></div>
          {/* Modal content */}
          <div ref={modalRef} className="mx-auto w-full overflow-hidden rounded-lg bg-white shadow-xl sm:max-w-sm">
            <div className="relative p-5 bg-white">
              <button onClick={() => setShowModal(false)} type="button" className="absolute top-4 right-4 rounded-lg p-1 text-center font-medium text-secondary-500 transition-all hover:bg-secondary-100">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-6 w-6">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
              <div className="text-center">
                <div>
                  <h3 className="text-lg font-medium text-secondary-900 mb-10">
                    Custom Game Mode
                  </h3>
                  <div className="mx-auto max-w-xs">
                    <div>
                      <div className="mb-6">
                        <label className="mb-1 block text-sm font-medium text-gray-700">Enter game lobby ID</label>
                        <input type="text" id="default-input"
                          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 text-center">
                        </input>
                      </div>
                    </div>
                  </div>
                  <div className="my-8 flex items-center gap-4 before:h-px before:flex-1 before:bg-gray-300  before:content-[''] after:h-px after:flex-1 after:bg-gray-300  after:content-['']">OR</div>
                  <div className="mx-auto max-w-xs">
                    <label className="mb-1 block text-sm font-medium text-gray-700">Upload file</label>
                    <label className="flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed border-gray-200 p-6 transition-all hover:border-primary-300">
                      <div className="space-y-1 text-center">
                        <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="h-6 w-6 text-gray-500">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                          </svg>
                        </div>
                        <div className="text-gray-600"><a href="#" className="font-medium text-primary-500 hover:text-primary-700">Click to upload</a> or drag and drop</div>
                        <p className="text-sm text-gray-500">CSV or JSON</p>
                      </div>
                      <input id="example5" type="file" className="sr-only" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-400 border-b-4 text-white border-blue-700 hover:border-blue-500 flex-1 rounded-lg border border-primary-500 bg-primary-500 px-4 py-2 text-center text-sm font-medium shadow-sm transition-all hover:border-primary-700 hover:bg-primary-700 focus:ring focus:ring-primary-200 disabled:cursor-not-allowed disabled:border-primary-300 disabled:bg-primary-300"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
