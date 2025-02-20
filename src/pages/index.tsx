import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import fonts from '../css/fonts.module.css';
import css from './index.module.css'
import React from 'react';
import { StyleSheet } from '../types/style';
import clsx from 'clsx';

const description = "Create and explore your own pixel world with our interactive drawing app! Design custom world maps, link them together, and play online with friends. Chat, explore, and bring your creativity to life in a fun and engaging community!";

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
      <div style={styles.container} className={clsx(css.gradient)}>
        <p className={clsx(fonts.pixelify)} style={styles.title}>
          {siteConfig.title}
        </p>
        <p className={clsx(fonts.pixelify)} style={styles.subtitle}>The player created pixel world</p>
        <div>
          <Link
            className="button button--secondary button--lg"
            to="/docs/intro">
            Player Guide
          </Link>
        </div>
      </div>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title} Guide`}
      description={description}>
      <HomepageHeader />
    </Layout>
  );
}

const styles: StyleSheet = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "column",
      width: "100%",
      flex: 1,
      backgroundColor: "#009d16",
      padding: 20
    },
    title: {
      fontSize: 60,
      color: "black",
      textAlign: "center",
      marginBottom: 0,
    },
    subtitle: {
      fontSize: 30,
      color: "white",
      textAlign: "center",
      marginBottom: 20
    }
}
