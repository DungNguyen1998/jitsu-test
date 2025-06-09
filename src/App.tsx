import { ConfigProvider, theme } from 'antd'
import HomePage from './pages/HomePage'
import { PRIMARY_COLOR } from './constants'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: PRIMARY_COLOR,
        },
      }}
    >
      <div className="min-h-screen bg-gray-50 p-6">
        <HomePage />
      </div>
    </ConfigProvider>
  )
}

export default App
