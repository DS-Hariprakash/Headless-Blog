import Link from 'next/link';
import PostEditor from '../../components/PostEditor';
import styles from './page.module.css';

export default function CreatePostPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link href="/admin">← Back to Admin</Link>
        <h1>Create New Post</h1>
      </header>

      <main className={styles.main}>
        <PostEditor />
      </main>
    </div>
  );
}
