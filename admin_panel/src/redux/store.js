// import { combineReducers, configureStore } from '@reduxjs/toolkit'
// import { persistReducer, persistStore } from 'redux-persist'
// import storage from 'redux-persist/lib/storage'
// import { baseApi } from './api/baseApi'
// import { authReducer } from './slice/authSlice'
// import { pressReducer } from './slice/pressSlice'
// import { memberReducer } from './slice/memberSlice'
// import { noticeReducer } from './slice/noticeSlice'
// import { eventReducer } from './slice/eventSlice'


// const rootReducer = combineReducers({
//    [baseApi.reducerPath]: baseApi.reducer,
//    auth: authReducer,
//    press: pressReducer,
//    member:memberReducer,
//    notice:noticeReducer,
//    event:eventReducer
// })

// const persistConfig = {
//    key: 'root',
//    storage,
//    whitelist: ['auth'],
// }
// const persistedReducer = persistReducer(persistConfig, rootReducer)

// export const store = configureStore({
//    reducer: persistedReducer,
//    middleware: (getDefaultMiddleware) =>
//       getDefaultMiddleware().concat(baseApi.middleware),
// })

// export const persist = persistStore(store)



import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { baseApi } from './api/baseApi'
import { authReducer } from './slice/authSlice'
import { pressReducer } from './slice/pressSlice'
import { memberReducer } from './slice/memberSlice'
import { noticeReducer } from './slice/noticeSlice'
import { eventReducer } from './slice/eventSlice'

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  press: pressReducer,
  member: memberReducer,
  notice: noticeReducer,
  event: eventReducer,
})

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth slice
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          'persist/PERSIST',
          'persist/REHYDRATE',
          'persist/PAUSE',
          'persist/FLUSH',
          'persist/PURGE',
          'persist/REGISTER',
        ],
      },
    }).concat(baseApi.middleware),
})

export const persist = persistStore(store)
