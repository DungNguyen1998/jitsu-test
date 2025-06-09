import { ConfigProvider, theme } from 'antd'
import HomePage from './pages/HomePage'

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1677ff',
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
