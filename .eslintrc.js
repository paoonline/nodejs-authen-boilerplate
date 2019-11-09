module.exports = {
    "env": {
      "browser": true
    },
    "parser": "babel-eslint",
    "extends": "airbnb",
    "rules": {
      "jsx-a11y/html-has-lang": [
        false
      ],
      "jsx-a11y/click-events-have-key-events": [
        false
      ],
      "jsx-a11y/no-noninteractive-element-interactions": [
        false
      ],
      "jsx-a11y/label-has-associated-control": [
        false,
      ],
      "jsx-a11y/label-has-for": [
        false,
      ],
      "react/jsx-filename-extension": [
        true,
        {
          "extensions": [
            ".js",
            ".jsx"
          ]
        }
      ],
      "react/prefer-stateless-function": [
        false,
        {
          "ignorePureComponents": 1
        }
      ],
      "react/prop-types": [
        false
      ],
      "react/forbid-prop-types": [
        false
      ],
      "linebreak-style": [
        "error", (process.platform === "win32" ? "windows" : "unix")
      ],
      "jsx-a11y/anchor-is-valid": [
        false,
      ],
      "import/prefer-default-export": [
        false,
      ],
      "react/no-array-index-key": [
        false,
      ],
    }
  }