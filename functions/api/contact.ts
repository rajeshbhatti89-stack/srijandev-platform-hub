export const onRequestPost = async (context: any): Promise<Response> => {
  try {
    const rawBody = (await context.request.json().catch(() => null)) as any;
    if (!rawBody || typeof rawBody !== 'object') {
      return new Response(JSON.stringify({ error: 'Invalid request payload.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { fullName, email, service, budget, message } = rawBody;
    if (!fullName || !email || !service || !message) {
      return new Response(JSON.stringify({ error: 'All required fields must be completed.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Forward to FormSubmit for direct delivery to contact@srijandev.in
    const res = await fetch('https://formsubmit.co/ajax/contact@srijandev.in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: fullName,
        email: email,
        _replyto: email,
        service: service,
        budget: budget || 'Not specified',
        message: message,
        _subject: `[New Lead] ${fullName} — ${service}`,
        _template: 'table',
        _captcha: 'false',
      }),
    });

    const data = (await res.json().catch(() => ({}))) as any;
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Message processed successfully.',
        data,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || 'Internal server error.' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
};
