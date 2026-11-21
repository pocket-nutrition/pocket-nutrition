import React from 'react';
import Content from '@theme-original/DocItem/Content';
import type ContentType from '@theme/DocItem/Content';
import type {WrapperProps} from '@docusaurus/types';
import {useDoc} from '@docusaurus/plugin-content-docs/client';
import Admonition from '@theme/Admonition';

type Props = WrapperProps<typeof ContentType>;

/**
 * Every documentation page opens with a "not reviewed" notice until a maintainer has read it and
 * added `reviewed: true` to its front matter. New pages are therefore unreviewed by default.
 */
export default function ContentWrapper(props: Props) {
  const {frontMatter} = useDoc();
  const isReviewed = (frontMatter as {reviewed?: boolean}).reviewed === true;
  return (
    <>
      {!isReviewed && (
        <Admonition type="caution" title="Not reviewed yet">
          A maintainer has not reviewed this page yet. It may contain mistakes, or describe something
          that is not released yet.
        </Admonition>
      )}
      <Content {...props} />
    </>
  );
}
