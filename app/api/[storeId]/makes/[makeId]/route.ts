import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs';

import prismadb from '@/lib/prismadb';

export async function GET(
	req: Request,
	{ params }: { params: { makeId: string } },
) {
	try {
		if (!params.makeId) {
			return new NextResponse('Make id is required', { status: 400 });
		}

		const make = await prismadb.make.findUnique({
			where: {
				id: params.makeId,
			},
		});

		return NextResponse.json(make);
	} catch (error) {
		console.log('[MAKE_GET]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { makeId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!params.makeId) {
			return new NextResponse('Make id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		const make = await prismadb.make.delete({
			where: {
				id: params.makeId,
			},
		});

		return NextResponse.json(make);
	} catch (error) {
		console.log('[MAKE_DELETE]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: { makeId: string; storeId: string } },
) {
	try {
		const { userId } = auth();

		const body = await req.json();

		const { name, imageUrl } = body;

		if (!userId) {
			return new NextResponse('Unauthenticated', { status: 403 });
		}

		if (!name) {
			return new NextResponse('Name is required', { status: 400 });
		}

		if (!imageUrl) {
			return new NextResponse('Image URL is required', { status: 400 });
		}

		if (!params.makeId) {
			return new NextResponse('Make id is required', { status: 400 });
		}

		const storeByUserId = await prismadb.store.findFirst({
			where: {
				id: params.storeId,
				userId,
			},
		});

		if (!storeByUserId) {
			return new NextResponse('Unauthorized', { status: 405 });
		}

		const make = await prismadb.make.update({
			where: {
				id: params.makeId,
			},
			data: {
				name,
				imageUrl,
			},
		});

		return NextResponse.json(make);
	} catch (error) {
		console.log('[MAKE_PATCH]', error);
		return new NextResponse('Internal error', { status: 500 });
	}
};
