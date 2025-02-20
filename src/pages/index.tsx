import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import styles from './index.module.css';
import '../css/fonts.css'

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <div className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <p className={clsx(styles.pixelify)} style={{fontFamily: 'Pixelify'}}>
          {siteConfig.title}
        </p>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            How to Play
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Guide`}
      description="Create and explore your own pixel world with our interactive drawing app! Design custom world layouts, link maps together, and play online with friends. Chat, explore, and bring your creativity to life in a fun and engaging community!">
      <HomepageHeader />
    </Layout>
  );
}
