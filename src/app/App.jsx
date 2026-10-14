import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SiteLayout } from '../presentation/components/templates'
import HomePage from '../presentation/pages/HomePage'
import ErrorPage from '../presentation/pages/ErrorPage'
import { lazyPage } from './lazyPage'

// Páginas internas carregadas sob demanda (cada rota vira um arquivo JS próprio)
const SobreNosPage = lazyPage(() => import('../presentation/pages/SobreNosPage'))
const ProjetosPage = lazyPage(() => import('../presentation/pages/ProjetosPage'))
const CabucuPage = lazyPage(() => import('../presentation/pages/CabucuPage'))
const ComoAjudarPage = lazyPage(() => import('../presentation/pages/ComoAjudarPage'))
const TransparenciaPage = lazyPage(() => import('../presentation/pages/TransparenciaPage'))
const BlogPage = lazyPage(() => import('../presentation/pages/BlogPage'))
const BlogPostPage = lazyPage(() => import('../presentation/pages/BlogPostPage'))
const ContatoPage = lazyPage(() => import('../presentation/pages/ContatoPage'))
const NotFoundPage = lazyPage(() => import('../presentation/pages/NotFoundPage'))

const FUTURE = {
  v7_relativeSplatPath: true,
  v7_fetcherPersist: true,
  v7_normalizeFormMethod: true,
  v7_partialHydration: true,
  v7_skipActionErrorRevalidation: true
}

const router = createBrowserRouter(
  [
    {
      element: <SiteLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          // erros de uma página aparecem dentro do layout (com menu e rodapé)
          errorElement: <ErrorPage inline />,
          children: [
            { path: '/', element: <HomePage /> },
            { path: '/sobrenos', element: <SobreNosPage /> },
            { path: '/projetos', element: <ProjetosPage /> },
            { path: '/cabucu', element: <CabucuPage /> },
            { path: '/comoajudar', element: <ComoAjudarPage /> },
            { path: '/transparencia', element: <TransparenciaPage /> },
            { path: '/blog', element: <BlogPage /> },
            { path: '/blog/:slug', element: <BlogPostPage /> },
            { path: '/contato', element: <ContatoPage /> },
            { path: '*', element: <NotFoundPage /> }
          ]
        }
      ]
    }
  ],
  { future: FUTURE }
)

export default function App() {
  return <RouterProvider router={router} future={{ v7_startTransition: true }} />
}
