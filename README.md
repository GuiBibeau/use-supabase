# Use Supabase

[![NPM](https://nodei.co/npm/use-supabase.png?compact=true)](https://npmjs.org/package/use-supabase)

This is a simple zero dependencies package that gives you access to your Supabase client using a React hook!

## Initialize Supabase

To get access to the hooks first pass use the SupabaseContextProvider at the root of your app.

#### Creat-React-App

```tsx
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import { SupabaseContextProvider } from 'use-supabase'

import reportWebVitals from './reportWebVitals'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('supabase-url', 'supabase-anon-key')

ReactDOM.render(
  <React.StrictMode>
    <SupabaseContextProvider client={supabase}>
      <App />
    </SupabaseContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

reportWebVitals()
```

#### Next.js

If you are using Next.js create a custom \_app.tsx like [explained here](https://nextjs.org/docs/advanced-features/custom-app).

## using the hooks

The context will make avaialble to the hooks the client and the user so that you can use it anywhere along the react component tree.

```tsx
import { useSupabase, useUser } from 'use-supabase'

const exampleComponent = () => {
  const { auth, from } = useSupabase()
  const user = useUser()

  if (user) {
    return <h1>Hello {user.email}</h1>
  }

  return <button>register</button>
}
```

## Future features (reach out for suggestions or submit a PR)

- [] ability to connect directly to the postgres instance directly
- [] converters to use with 'from' to have strongly typed data
