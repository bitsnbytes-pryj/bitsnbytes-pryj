import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function GET(request: NextRequest) {
  return NextResponse.redirect('https://perfect-dinghy-781.notion.site/33b49ed2fc3380f89ce2e43855c982db');
}

export const dynamic = 'force-static';
