<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <link
   rel="shortcut icon" href="{{ asset('storage/icon.png') }}" type="image/x-icon"
  />
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
    <title>{{  env('APP_NAME') }}</title>
    @viteReactRefresh
    @vite('resources/js/app.jsx')
    @inertiaHead
  </head>
  <body>
    @inertia
    @routes
  </body>
</html>