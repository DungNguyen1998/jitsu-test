import { ConfigProvider, theme, App as AntdApp } from 'antd'
import { Routes, Route } from 'react-router-dom'
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
      <AntdApp>
        <div className="mx-auto min-h-screen bg-gray-50 p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes here as needed */}
          </Routes>
        </div>
      </AntdApp>
    </ConfigProvider>
  )
}

export default App
