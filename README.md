# Jovius

Jovius is a utility library for managing environment-specific configurations and conditional code removal in React
and TypeScript projects. Inspired by the Roman Emperor Jovius who divided the Roman Empire, this library helps you
elegantly separate development and production code, ensuring clean and optimized production builds while maintaining
flexibility during development.

## Features
- **🗑️ Code Removal**: Automatically remove development-only code in production builds using `babel-plugin-macros`.
- **⚛️ React Support**: React components to help manage environment-specific code in React components.
- **📘 TypeScript Support**: Fully typed with TypeScript.
- **🚫 Zero Bundle Size Impact**: No runtime overhead or bundle size impact.
- **🔧 Customizable**: Use custom environment variables and feature flags to manage environment-specific code.
- **🎨 CSS Directives**: Conditionally apply styles based on the environment.
- **🔗 Utility Functions**: Use utility functions to manage environment-specific code in TypeScript projects.

## Usage
### Utility Functions

Use the provided utility functions to manage environment-specific code in your TypeScript projects.
It uses process.env.NODE_ENV to determine the current environment.

```typescript
import { whenDev, whenProd, whenEnv, switchEnv } from 'jovius/macro';
import clsx from 'clsx';

// Conditionally apply class names
const className = clsx('common-class', whenDev('dev-class', 'prod-class'));

// Use environment-specific values
const apiEndpoint = whenDev('http://localhost:3000', 'https://api.example.com');
const featureFlag = whenProd(false, true); // false in prod, true in dev
const customEnvValue = whenEnv('test', 'test-value', 'default-value'); // 'test-value' in test env, 'default-value' otherwise
const customEnvMultiptle = whenEnv(['test', 'staging'], 'test-value', 'default-value'); // 'test-value' in test and staging env, 'default-value' otherwise
const customEnvSwitch = switchEnv({
  test: 'test-value',
  staging: 'staging-value'
}, 'default-value'); // 'test-value' in test env, 'staging-value' in staging env, 'default-value' otherwise
```

Run code only in specific environments.

```typescript
import { whenDev, whenProd, whenEnv, switchEnv } from 'jovius/macro';

whenDev(() => {
  console.log('This code will only run in development mode');
});

whenProd(() => {
  console.log('This code will only run in production mode');
});

whenEnv('test', () => {
  console.log('This code will only run in test environment');
});

whenEnv(['test', 'staging'], () => {
  console.log('This code will only run in test or staging environment');
});

switchEnv({
  test: () => {
    console.log('This code will only run in test environment');
  },
  staging: () => {
    console.log('This code will only run in staging environment');
  }
}, () => {
  console.log('This code will run if no environment matches');
});
```

#### Using with feature flags

You can use feature flag utilities to conditionally enable or disable features based on custom flags in the environment variables.

```typescript
import { whenFeature, switchFeature } from 'jovius/macro';

// FEATURE_FLAG is a custom environment variable
const featureFlag = whenFeature('FEATURE_FLAG', true, false); // true if FEATURE_FLAG is set, false otherwise
const featureFlagMulti = whenFeature(['FEATURE_FLAG', 'FEATURE_FLAG_2'], true, false); // true if FEATURE_FLAG or FEATURE_FLAG_2 is set, false otherwise
const featureFlagSwitch = switchFeature({
  FEATURE_FLAG: 'value',
  FEATURE_FLAG_2: 'value2'
}, 'default-value'); // true if FEATURE_FLAG is set, false if FEATURE_FLAG_2 is set, false otherwise
```

Run code only if a feature flag is set.

```typescript
import { whenFeature, switchFeature } from 'jovius/macro';

whenFeature('FEATURE_FLAG', () => {
  console.log('This code will only run if FEATURE_FLAG is set');
});

switchFeature({
  FEATURE_FLAG: () => {
    console.log('This code will only run if FEATURE_FLAG is set');
  },
  FEATURE_FLAG_2: () => {
    console.log('This code will only run if FEATURE_FLAG_2 is set');
  }
}, () => {
  console.log('This code will run if no feature flag matches');
});
```

#### Note

You can't use these functions for assigning values and running code in the same line. This is because the function argument will be executed only in the specified environment, and the value will be assigned in all environments. This can lead to unexpected behavior.

```typescript
// ❌ Don't use function argument for assigning values
const value = whenDev(() => 'dev-value', 'prod-value'); // ❌
const value = whenDev('dev-value', 'prod-value'); // ✅

// Use function argument for running code
whenDev(
  () => {
    console.log('This code will only run in development mode');
  },
  // Can be omitted if no code is to be run in production
  () => {
    console.log('This code will only run in production mode');
  }
); // ✅
```

#### Usage in react components

```tsx
import { whenDev, whenProd, whenFeature, env } from 'jovius/macro';

const MyComponent: React.FC = () => {
  // Usage with feature flags
  const className = clsx('common-class', whenFeature('FEATURE_FLAG', 'feature-class'));
  
  return (
    <div>
      {whenDev(<p>Running in development mode</p>)}
      {whenProd(<p>Running in production mode</p>)}
      <p>Current environment: {env}</p>
    </div>
  );
};
```

### React Components
React specific utilities are also provided to help manage environment-specific code in React components. They are located under `jovius/react`.

#### \<DevOnly /> Component
```typescript
import { DevOnly } from 'jovius/react.macro';

const MyComponent: React.FC = () => {
  return (
    <div>
      <DevOnly>
        <p>This text will only be rendered in development mode.</p>
      </DevOnly>
      <DevOnly fallback={"This text will be shown in production."}>
        <p>This text will only be rendered in development mode.</p>
      </DevOnly>
      <p>This text will always be rendered.</p>
    </div>
  );
};
```

#### \<ProdOnly /> Component
```typescript
import { ProdOnly } from 'jovius/react.macro';

const MyComponent: React.FC = () => {
  return (
    <div>
      <ProdOnly>
        <p>This text will only be rendered in production mode.</p>
      </ProdOnly>
      <p>This text will always be rendered.</p>
    </div>
  );
};
```

#### \<When /> Component
```typescript
import { When } from 'jovius/react.macro';

const MyComponent: React.FC = () => {
  return (
  <div>
    <When isDev>
      <p>This text will only be rendered in development mode.</p>
    </When>
    <When isProd>
      <p>This text will only be rendered in production mode.</p>
    </When>
    // Custom environment
    <When is="staging">
      <p>This text will only be rendered in production mode.</p>
    </When>
    // Custom feature flag
    <When feature="FEATURE_FLAG">
      <p>This text will only be rendered if FEATURE_FLAG is set.</p>
    </When>
    
    // Can be used together
    <When isDev feature="FEATURE_FLAG">
      <p>This text will only be rendered in development mode if FEATURE_FLAG is set.</p>
    </When>
    <p>This text will always be rendered.</p>
  </div>
  );
};
```

#### HOCs
```typescript
import { withDev, withProd, withEnv, withFeature } from 'jovius/react.macro';

const MyComponent: React.FC = () => {
  return (
    <div>
      <p>My component</p>
    </div>
  );
};

// Wrap the component with withEnv HOC
// The component will only be rendered in the specified environment
export default withDev(MyComponent);
export default withProd(MyComponent);
export default withEnv(MyComponent, 'staging');

// Multiple environments
export default withEnv(MyComponent, ['development', 'staging']);

// Custom feature flag
export default withFeature(MyComponent, 'FEATURE_FLAG');

// Multiple feature flags
export default withFeature(MyComponent, ['FEATURE_FLAG', 'FEATURE_FLAG_2']);
```

### CSS directives

You can use the provided CSS directives to conditionally apply styles based on the environment.

```scss 
/* styles.css */
.some-class {
  color: red;
}

@when-dev {
    .some-class {
        color: blue;
    }
}

@when-prod {
    .some-class {
        color: green;
    }
}

@when-env test {
    .some-class {
        color: yellow;
    }
}

@when-env test, staging {
    .some-class {
        color: orange;
    }
}

@switch-env {
    test {
        .some-class {
            color: purple;
        }
    }
    staging {
        .some-class {
            color: pink;
        }
    }
    default {
        .some-class {
            color: black;
        }
    }
}

@when-feature FEATURE_FLAG {
    .some-class {
        color: brown;
    }
}

/* scss includes */

.some-class {
  color: red;

  @include when-dev {
    color: blue;
  }

  @include when-prod {
    color: green;
  }

  @include when-env(test) {
    color: yellow;
  }

  @include when-env(test, staging) {
    color: orange;
  }

  @include switch-env {
    test {
      color: purple;
    }
    staging {
      color: pink;
    }
    default {
      color: black;
    }
  }

  @include when-feature(FEATURE_FLAG) {
    color: brown;
  }
}  

// scss functions
.some-class {
  color: whenDev(blue, red);
}

.some-class {
  color: whenProd(green, red);
}

.some-class {
  color: whenEnv('test', yellow, red);
}

.some-class {
  color: whenEnv('test, staging', orange, red);
}

.some-class {
  color: whenFeature('FEATURE_FLAG', brown, red);
}
```

## API

### Utility Functions

#### `whenDev(devValue: T | () => void, prodValue?: T): T`

Replace the value with `devValue` in development environment and `prodValue` in production environment.

| Param       | Type              | Default     | Description                                                      |
|-------------|-------------------|-------------|------------------------------------------------------------------|
| `devValue`  | `T \| () => void` | -           | Value to return in development environment. Throws if undefined. |
| `prodValue` | `T`               | `undefined` | Value to return in production environment                        |

#### `whenProd(prodValue: T | () => void, devValue?: T): T`

Replace the value with `prodValue` in production environment and `devValue` in development environment.

| Param       | Type              | Default     | Description                                                     |
|-------------|-------------------|-------------|-----------------------------------------------------------------|
| `prodValue` | `T \| () => void` | -           | Value to return in production environment. Throws if undefined. |
| `devValue`  | `T`               | `undefined` | Value to return in development environment                      |


#### `whenEnv(env: string | string[], envValue: T | () => void, defaultValue: T): T`


## How it works

Jovius uses `babel-plugin-macros` to remove development-only code in production builds. It uses the `process.env.NODE_ENV` variable to determine the current environment. The provided utility functions and React components use this variable to conditionally apply code based on the environment.
For css directives, it uses `postcss` to conditionally apply styles based on the environment.

## Installation

```sh
npm install jovius
