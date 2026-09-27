# Jev Bocc Impact

    **Map French collective-agreement changes to reviewable payroll and HR impacts, filtered by exact IDCC.**

    [![Tests](https://github.com/gbesse/jev-bocc-impact/actions/workflows/test.yml/badge.svg)](https://github.com/gbesse/jev-bocc-impact/actions/workflows/test.yml) [MIT](LICENSE) · Node.js 22+ · Public alpha

    ## Try it

    ```sh
    git clone https://github.com/gbesse/jev-bocc-impact.git
    cd jev-bocc-impact
    npm install
    npm run demo
    ```

    The demo uses synthetic records and fixture probabilities. It makes no network call and makes no claim about measured Jev quality.

    ## Use the library

    Import the domain functions from `@gbesse/jev-bocc-impact` and provide either `createJevClient()` from the `./jev` export or the offline `createFakeProvider()` test double. The complete runnable path is in `examples/demo.mjs`.

    ## Decision boundary

    Exact IDCC mismatch prevents a model call. Jev classifies the operational domain and urgency only after that filter. Every applicable result requires HR or legal review.

    ## Data provenance

    BOCC is published weekly by the DILA and contains deposited texts that complete or modify collective agreements. The official open-data page also states its attribution requirements.

    Official references:

    - [https://www.data.gouv.fr/datasets/bocc-bulletin-officiel-des-conventions-collectives](https://www.data.gouv.fr/datasets/bocc-bulletin-officiel-des-conventions-collectives)
- [https://www.data.gouv.fr/datasets/liste-des-conventions-collectives-par-entreprise-siret](https://www.data.gouv.fr/datasets/liste-des-conventions-collectives-par-entreprise-siret)

    Keep upstream attribution, source URLs, retrieval dates and original identifiers with every derived record.

    ## Real Jev requests

    Real requests are opt-in, paid, and sent to `https://api.typesafe.ai/v1/systemone`. The client pins `jev-1.13.0`, validates the returned model and all probabilities, rejects redirects, retries only network failures plus HTTP 429/529, and refuses state above a conservative 24,000-token estimate.

    ```sh
    TYPESAFE_API_KEY=... node scripts/live-smoke.mjs
    ```

    Never send personal data, secrets, or full unredacted case files. Evaluate representative French labels before operational use.

    ## Validation

    `npm run validate` runs syntax checks, strict public-type checks, tests, and the offline demo on Node.js 22 and 24 in CI.

    Independent project; not affiliated with TypeSafe AI or the French administration. See the [Jev API documentation](https://docs.typesafe.ai/api) and [model limitations](https://docs.typesafe.ai/model-jaggedness/jev-1.13).
